import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Modal,
  ActivityIndicator,
  TextInput,
  StatusBar,
} from 'react-native';
import { Camera as RNCamera } from 'expo-camera';
import {
  FrontFrame,
  FrontLine,
  TopFrame,
  TopLine,
  LeftFrame,
  LeftLine,
  RightFrame,
  DownFrame,
  RightLine,
  DownLine,
  GuideFront,
  GuideLeft,
  GuideRight,
  GuideUp,
  GuideDown,
  tersenyum,
} from '../../assets';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { manipulateAsync } from 'expo-image-manipulator';
import { Endpoint } from '../../Utils/Endpoint';
import * as FaceDetector from 'expo-face-detector';
import * as faceapi from 'face-api.js';
import SubHeader from '../../Component/SubHeader';
import { Fonts } from '../../Utils/Fonts';
import Icon from '@expo/vector-icons/MaterialIcons';
import { shuffleAllArray } from '../../Utils/Shuffle';
import SoundPlayer from 'react-native-sound-player';
import WarningModal from '../../Component/WarningModal';

const RegisterScreen = ({ route }) => {
  const [camera, setCamera] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [hint, setHint] = useState(false);
  const [step, setStep] = useState(0);
  const [failed, setFailed] = useState(false);
  const [label, setLabel] = useState('');
  const [labelModal, setLabelModal] = useState(false);
  const [images, setImages] = useState([]);
  const [regisModal, setRegisModal] = useState(false);
  const [status, setStatus] = useState('');
  const isFocused = useIsFocused();
  const [isAlready, setIsAlready] = useState(false);
  const [message, setMessage] = useState('');
  const [RandomPhase, setRandomPhase] = useState(shuffleAllArray([1, 2, 3, 4]));
  const [cameraFront, setCameraFront] = useState(true);

  const filename = () => {
    const val = RandomPhase[step];
    if (val === 1) {
      return 'look_camera';
    } else if (val === 2) {
      return 'look_left';
    } else if (val === 3) {
      return 'look_right';
    } else if (val === 4) {
      return 'look_up';
    } else if (val === 5) {
      return 'smile';
    }
  };

  const playSound = async () => {
    SoundPlayer.playSoundFile(filename(), 'mp3');
  };

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        playSound();
      }, 1000);
    }
  }, [isFocused, step]);

  const isRegistered = async () => {
    setIsLoading(true);
    const url =
      Endpoint.GetDataset +
      `?query={"limit":1000, "where": {"label": "${label}"} }`;
    try {
      const res = await axios.get(url);
      if (res) {
        console.log(res.data?.data?.length);
        if (res.data?.data?.length > 0) {
          setIsAlready(true);
        } else {
          setLabelModal(false);
          setHint(true);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error, 'error');
      setLabelModal(false);
      setHint(true);
      setIsLoading(false);
    }
  };

  const Frame = () => {
    const val = RandomPhase[step];
    if (val === 1) {
      return FrontFrame;
    } else if (val === 2) {
      return LeftFrame;
    } else if (val === 3) {
      return RightFrame;
    } else if (val === 4) {
      return TopFrame;
    } else if (val === 5) {
      return DownFrame;
    }
  };

  const Direction = () => {
    const val = RandomPhase[step];
    if (val === 1) {
      return 'Depan';
    } else if (val === 2) {
      return 'Kiri';
    } else if (val === 3) {
      return 'Kanan';
    } else if (val === 4) {
      return 'Atas';
    } else if (val === 5) {
      return 'Bawah';
    }
  };

  const Line = () => {
    const val = RandomPhase[step];
    if (val === 1) {
      return FrontLine;
    } else if (val === 2) {
      return LeftLine;
    } else if (val === 3) {
      return RightLine;
    } else if (val === 4) {
      return TopLine;
    } else if (val === 5) {
      return DownLine;
    }
  };

  const Guide = () => {
    const val = RandomPhase[step];
    if (val === 1) {
      return GuideFront;
    } else if (val === 2) {
      return GuideLeft;
    } else if (val === 3) {
      return GuideRight;
    } else if (val === 4) {
      return GuideUp;
    } else if (val === 5) {
      return GuideDown;
    }
  };

  const detected = async image => {
    let formData = new FormData();
    const val = RandomPhase[step];
    const corner = () => {
      if (val === 1) {
        return 'front';
      } else if (val === 2) {
        return 'left';
      } else if (val === 3) {
        return 'right';
      } else if (val === 4) {
        return 'top';
      }
    };
    formData.append('image', {
      uri: image.uri,
      type: 'image/jpeg',
      name: 'image.jpg',
    });
    formData.append('corner', corner());
    try {
      const res = await axios.post(Endpoint.Validate, formData, {
        headers: {
          Accept: 'multipart/form-data',
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res.data === '', 'empty');
      console.log(res.data, 'data');
      if (res) {
        return { valid: true, message: res.data.message };
      }
    } catch (error) {
      console.log(error.response, 'error api');
      return { valid: true, message: 'Gagal mengambil data' };
    }
  };

  const checkFaceCorner = async (image, scoreThreshold = 0.4) => {
    const res = await faceapi
      .detectSingleFace(
        image,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold }),
      )
      .withFaceLandmarks();

    if (res) {
      const eye_right = getMeanPosition(res.landmarks.getRightEye());
      const eye_left = getMeanPosition(res.landmarks.getLeftEye());
      const nose = getMeanPosition(res.landmarks.getNose());
      const mouth = getMeanPosition(res.landmarks.getMouth());
      const jaw = getTop(res.landmarks.getJawOutline());

      const rx = (jaw - mouth[1]) / res.detection.box.height + 0.5;
      const ry =
        (eye_left[0] + (eye_right[0] - eye_left[0]) / 2 - nose[0]) /
        res.detection.box.width;

      let state = 'undetected';
      if (res.detection.score > 0.3) {
        state = 'front';
        if (rx > 0.2) {
          state = 'top';
        } else {
          if (ry < -0.04) {
            state = 'left';
          }
          if (ry > 0.04) {
            state = 'right';
          }
        }
      }
      return state;
    }
    return res;
  };

  const getTop = (l = []) => {
    return l.map(a => a.y).reduce((a, b) => Math.min(a, b));
  };

  const getMeanPosition = (l = []) => {
    return l
      .map(a => [a.x, a.y])
      .reduce((a, b) => [a[0] + b[0], a[1] + b[1]])
      .map(a => a / l.length);
  };

  const detectUp = async image => {
    try {
      const res = await FaceDetector.detectFacesAsync(image.uri, {
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
        runClassifications: FaceDetector.FaceDetectorClassifications.none,
      });
      if (res.faces.length > 0) {
        const { bounds } = res.faces[0];
        const { origin, size } = bounds;
        const crop = {
          originX: origin.x,
          originY: origin.y,
          height: size.height,
          width: size.width,
        };
        const resize = { width: 160, height: 160 };

        const result = await manipulateAsync(image.uri, [{ crop }, { resize }]);
        const corner = await FaceDetector.detectFacesAsync(result.uri, {
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
        });
        const jaw = corner.faces[0].BOTTOM_MOUTH.y;
        if (jaw <= 136) {
          // Top
          console.log('top');
          return { valid: true, message: 'Correct' };
        } else {
          return { valid: false, message: 'Posisi Salah' };
        }
      } else {
        return { valid: false, message: 'No Face Detected' };
      }
    } catch (error) {
      console.log(error, 'error');
      return { valid: false, message: 'Error Image' };
    }
  };

  const detectFront = async image => {
    try {
      const res = await FaceDetector.detectFacesAsync(image.uri, {
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
        runClassifications: FaceDetector.FaceDetectorClassifications.none,
      });
      if (res.faces.length > 0) {
        const { bounds } = res.faces[0];
        const { origin, size } = bounds;
        const crop = {
          originX: origin.x,
          originY: origin.y,
          height: size.height,
          width: size.width,
        };
        const resize = { width: 160, height: 160 };

        const result = await manipulateAsync(image.uri, [{ crop }, { resize }]);
        const corner = await FaceDetector.detectFacesAsync(result.uri, {
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
        });
        const { x, y } = corner.faces[0].NOSE_BASE;
        if (x <= 85 && x >= 70) {
          // Center
          console.log('center');
          return { valid: true, message: 'Correct' };
        } else {
          return { valid: false, message: 'Posisi Salah' };
        }
      } else {
        return { valid: false, message: 'No Face Detected' };
      }
    } catch (error) {
      console.log(error, 'error');
      return { valid: false, message: 'Error Image' };
    }
  };

  const detectLeft = async image => {
    try {
      const res = await FaceDetector.detectFacesAsync(image.uri, {
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
        runClassifications: FaceDetector.FaceDetectorClassifications.none,
      });
      if (res.faces.length > 0) {
        const { bounds } = res.faces[0];
        const { origin, size } = bounds;
        const crop = {
          originX: origin.x,
          originY: origin.y,
          height: size.height,
          width: size.width,
        };
        const resize = { width: 160, height: 160 };

        const result = await manipulateAsync(image.uri, [{ crop }, { resize }]);
        const corner = await FaceDetector.detectFacesAsync(result.uri, {
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
        });
        const { x, y } = corner.faces[0].NOSE_BASE;
        if (x >= 90) {
          // Left
          console.log('left');
          return { valid: true, message: 'Correct' };
        } else {
          return { valid: false, message: 'Posisi Salah' };
        }
      } else {
        return { valid: false, message: 'No Face Detected' };
      }
    } catch (error) {
      console.log(error, 'error');
      return { valid: false, message: 'Error Image' };
    }
  };

  const detectRight = async image => {
    try {
      const res = await FaceDetector.detectFacesAsync(image.uri, {
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
        runClassifications: FaceDetector.FaceDetectorClassifications.none,
      });
      if (res.faces.length > 0) {
        const { bounds } = res.faces[0];
        const { origin, size } = bounds;
        const crop = {
          originX: origin.x,
          originY: origin.y,
          height: size.height,
          width: size.width,
        };
        const resize = { width: 160, height: 160 };

        const result = await manipulateAsync(image.uri, [{ crop }, { resize }]);
        const corner = await FaceDetector.detectFacesAsync(result.uri, {
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
        });
        const { x, y } = corner.faces[0].NOSE_BASE;
        if (x <= 65) {
          // Right
          console.log('right');
          return { valid: true, message: 'Correct' };
        } else {
          return { valid: false, message: 'Posisi Salah' };
        }
      } else {
        return { valid: false, message: 'No Face Detected' };
      }
    } catch (error) {
      console.log(error, 'error');
      return { valid: false, message: 'Error Image' };
    }
  };

  const detectCorner = async image => {
    try {
      const res = await FaceDetector.detectFacesAsync(image.uri, {
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
        runClassifications: FaceDetector.FaceDetectorClassifications.none,
      });
      if (res.faces.length > 0) {
        const { bounds } = res.faces[0];
        const { origin, size } = bounds;
        const crop = {
          originX: origin.x,
          originY: origin.y,
          height: size.height,
          width: size.width,
        };
        const resize = { width: 160, height: 160 };

        const result = await manipulateAsync(image.uri, [{ crop }, { resize }]);
        const corner = await FaceDetector.detectFacesAsync(result.uri, {
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
        });
        const { x, y } = corner.faces[0].NOSE_BASE;
        const jaw = corner.faces[0].bottomMouthPosition.y;
        console.log(jaw, 'face');
        if (x >= 90) {
          // Left
          console.log('left');
        } else if (x <= 65) {
          // Right
          console.log('right');
        } else if (x <= 85 && x >= 70) {
          // Center
          console.log('center');
        }
        if (jaw <= 136) {
          // Top
          console.log('top');
        }
      }
    } catch (error) {
      console.log(error, 'error');
    }
    return { valid: true, message: 'valid' };
  };

  const takePicture = async () => {
    const option = {
      quality: 1,
    };
    try {
      const image = await camera.takePictureAsync();
      setIsLoading(true);
      if (image) {
        console.log(image, 'position');
        // const res = await detectCorner(image);
        cropImage(image);
        // console.log(position);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const register = async () => {
    navigation.replace('Preview Screen', { preview: images, ...route?.params });
    // let formData = new FormData();
    // images.forEach((item, index) => {
    //   formData.append('images', {
    //     uri: item.uri,
    //     type: 'image/jpeg',
    //     name: 'image' + index + '.jpg',
    //   });
    // });
    // formData.append('label', label);

    // try {
    //   const resApi = await axios.post(Endpoint.Register, formData, {
    //     headers: {
    //       Accept: 'multipart/form-data',
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   });
    //   if (resApi) {
    //     console.log(resApi.data, 'data register');
    //     setIsLoading(false);
    //     setStatus('Pendaftaran Berhasil');
    //     setRegisModal(true);
    //   }
    // } catch (error) {
    //   console.log(error, 'error register api');
    //   setRegisModal(true);
    //   setStatus('Pendaftaran Gagal ' + error?.response?.data?.message);
    //   setIsLoading(false);
    // }
  };

  useEffect(() => {
    if (images.length === 4) {
      setIsLoading(true);
      register();
    }
  }, [images]);

  const cropImage = async image => {
    try {
      const resize = await manipulateAsync(image.uri, [
        { resize: { width: 768, height: 1024 } },
      ]);
      let position = undefined;
      //   await RNFS.copyFile(mobilenet.uri, pathMobilenet);
      const val = RandomPhase[step];
      if (val === 1) {
        position = await detectFront(image);
      } else if (val === 2) {
        position = await detectLeft(image);
      } else if (val === 3) {
        position = await detectRight(image);
      } else {
        position = await detectUp(image);
      }
      if (position !== undefined && position.valid) {
        // const result = await manipulateAsync(resize.uri, [
        //   {
        //     crop: {
        //       width: box._width + 50,
        //       height: box._height + 50,
        //       originX: box._x,
        //       originY: box._y,
        //     },
        //   },
        //   {
        //     resize: {
        //       width: box._width + 50,
        //       height: box._height + 50,
        //     },
        //   },
        // ]);
        setImages([...images, resize]);
        if (step < 3) {
          setStep(step + 1);
          setHint(true);
        }
        //  else {
        //   await register();
        // }
      } else {
        setFailed(true);
        setMessage(position?.message);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error, 'error image');
      setFailed(true);
      setMessage('Gagal Mengambil Gambar');
      setIsLoading(false);
    }
  };

  const showModal = () => {
    const val = RandomPhase[step];
    if (isLoading) {
      return (
        <Modal transparent visible={isLoading}>
          <View style={styles.modalContainer}>
            <View style={styles.wrappers}>
              <ActivityIndicator size={'large'} color={'#000'} />
            </View>
          </View>
        </Modal>
      );
    }
    if (hint && val === 1) {
      return (
        <Modal transparent visible={hint && val === 1}>
          <View style={styles.modalContainer}>
            <View style={styles.wrappers}>
              <Text style={styles.direction}>Hadap Depan</Text>
              <View style={styles.hintImage}>
                <Image style={styles.image} source={GuideFront} />
              </View>
              <Text style={styles.hintText}>
                {
                  'Posisikan kepala anda tegak menghadap kamera sesuai dengan bingkai pada layar anda, pastikan mata tidak berkedip ketika mengambil foto\n \nKedua mata harus terlihat di layar dan lihat kamera saat mengambil foto'
                }
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setHint(false)}
                style={styles.hintButton}
              >
                <Text style={styles.hintButtonTitle}>Saya Mengerti</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }
    if (hint && val === 2) {
      return (
        <Modal transparent visible={hint && val === 2}>
          <View style={styles.modalContainer}>
            <View style={styles.wrappers}>
              <Text style={styles.direction}>Hadap Kiri</Text>
              <View style={styles.hintImage}>
                <Image style={styles.image} source={GuideLeft} />
              </View>
              <Text style={styles.hintText}>
                {
                  'Gerakan kepala anda sedikit (kurang lebih 30 derajat) kearah Kiri sesuai dengan bingkai pada layar anda \n\n Kedua mata harus terlihat di layar dan lihat kamera saat mengambil foto.'
                }
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setHint(false)}
                style={styles.hintButton}
              >
                <Text style={styles.hintButtonTitle}>Saya Mengerti</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }
    if (hint && val === 3) {
      return (
        <Modal transparent visible={hint && val === 3}>
          <View style={styles.modalContainer}>
            <View style={styles.wrappers}>
              <Text style={styles.direction}>Hadap Kanan</Text>
              <View style={styles.hintImage}>
                <Image style={styles.image} source={GuideRight} />
              </View>
              <Text style={styles.hintText}>
                {
                  'Gerakan kepala anda sedikit (kurang lebih 30 derajat) kearah Kanan sesuai dengan bingkai pada layar anda \n\n Kedua mata harus terlihat di layar dan lihat kamera saat mengambil foto.'
                }
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setHint(false)}
                style={styles.hintButton}
              >
                <Text style={styles.hintButtonTitle}>Saya Mengerti</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }
    if (hint && val === 4) {
      return (
        <Modal transparent visible={hint && val === 4}>
          <View style={styles.modalContainer}>
            <View style={styles.wrappers}>
              <Text style={styles.direction}>Hadap Atas</Text>
              <View style={styles.hintImage}>
                <Image style={styles.image} source={GuideUp} />
              </View>
              <Text style={styles.hintText}>
                {
                  'Gerakan kepala anda sedikit (kurang lebih 30 derajat) kearah atas sesuai dengan bingkai pada layar anda \n\n Kedua mata harus terlihat di layar dan lihat kamera saat mengambil foto.'
                }
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setHint(false)}
                style={styles.hintButton}
              >
                <Text style={styles.hintButtonTitle}>Saya Mengerti</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }
    if (hint && val === 5) {
      return (
        <Modal transparent visible={hint && val === 5}>
          <View style={styles.modalContainer}>
            <View style={styles.wrappers}>
              <View style={styles.hintImage}>
                <Image style={styles.image} source={GuideDown} />
              </View>
              <Text style={styles.hintText}>
                {
                  'Gerakan kepala anda sedikit (kurang lebih 30 derajat) kearah bawah sesuai dengan bingkai pada layar anda \n\n Kedua mata harus terlihat di layar dan lihat kamera saat mengambil foto.'
                }
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setHint(false)}
                style={styles.hintButton}
              >
                <Text style={styles.hintButtonTitle}>Saya Mengerti</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }
    if (failed) {
      return (
        <WarningModal
          content={`Gambar Tidak Valid Pastikan Gambar Anda sesuai petunjuk dan Harap Coba lagi \n\n ${message}`}
          visible={failed}
          onPress={() => setFailed(false)}
        />
        // <Modal transparent visible={failed}>
        //   <View style={styles.modalContainer}>
        //     <View style={styles.wrappers}>
        //       <Text style={styles.hintText}>
        // Gambar Tidak Valid Pastikan Gambar Anda sesuai petunjuk dan
        // Harap Coba lagi {'\n\n'} {message}
        //       </Text>
        //       <TouchableOpacity
        //         activeOpacity={0.8}
        //         onPress={() => setFailed(false)}
        //         style={styles.failedButton}
        //       >
        //         <Text style={styles.hintButtonTitle}>Coba Lagi</Text>
        //       </TouchableOpacity>
        //     </View>
        //   </View>
        // </Modal>
      );
    }
    if (isAlready) {
      return (
        <Modal transparent visible={isAlready}>
          <View style={styles.modalContainer}>
            <View style={styles.wrappers}>
              <Text style={styles.hintText}>Nama {label} sudah terdaftar</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('Home');
                }}
                style={styles.failedButton}
              >
                <Text style={styles.hintButtonTitle}>Kembali</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }
    if (labelModal) {
      return (
        <Modal transparent visible={labelModal}>
          <View style={styles.modalContainer}>
            <View style={styles.wrappers}>
              <TextInput
                placeholder={'Masukan Nama'}
                value={label}
                onChangeText={val => setLabel(val)}
                style={styles.inputName}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  isRegistered();
                }}
                disabled={label == ''}
                style={styles.button}
              >
                <Text style={styles.buttonTitle}>Masukan Nama</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.goBack();
                }}
                style={styles.buttonCancel}
              >
                <Text style={styles.buttonCancelTitle}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }
    if (regisModal) {
      return (
        <Modal transparent visible={regisModal}>
          <View style={styles.modalContainer}>
            <View style={styles.wrappers}>
              <Text style={styles.hintText}>{status}</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setRegisModal(false);
                  navigation.navigate('Home', {
                    sync: status == 'Pendaftaran Berhasil' ? true : false,
                  });
                  // navigation.navigate('Preview Screen', {
                  //   preview: images,
                  //   label: label,
                  // });
                }}
                style={styles.hintButton}
              >
                <Text style={styles.hintButtonTitle}>oke</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }
  };

  return (
    <View style={styles.parent}>
      <StatusBar translucent={false} backgroundColor={'#195FBA'} />
      <SubHeader title={'Kembali'} onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        {showModal()}
        <View style={styles.stepContainer}>
          <View style={styles.left}>
            <Image style={styles.image} source={Guide()} />
          </View>
          <View style={styles.right}>
            <Text style={styles.step}>
              {step + 1}/4 Hadap {Direction()}
            </Text>
            <Text style={styles.stepTxt}>Pastikan mata melihat kamera</Text>
          </View>
        </View>
        {isFocused && !isLoading ?(
          <View style={styles.wrapper}>
              <RNCamera
                style={styles.preview}
                ref={ref => setCamera(ref)}
                type={cameraFront ? 'front' : 'back'}
                autoFocus={'on'}
              />
              <Image style={styles.frame} source={Frame()} />
              <Image style={styles.line} source={Line()} />
          </View>
        ) : null}
        <View style={styles.cameraContainer}>
          <View activeOpacity={0.8} style={styles.switchCamera}>
            <Icon
              name={'flip-camera-ios'}
              size={35}
              color={'#A0A0A0'}
              style={{ opacity: 0 }}
            />
          </View>
          <TouchableOpacity
            style={styles.takeButton}
            onPress={takePicture}
            disabled={camera === undefined}
            activeOpacity={0.5}
          >
            <View style={styles.circle} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCameraFront(!cameraFront)} activeOpacity={0.8} style={styles.switchCamera}>
            <Icon name={'flip-camera-ios'} size={35} color={'#A0A0A0'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  preview: {
    width: '100%',
    height: undefined,
    aspectRatio: 3 / 4,
  },
  frame: {
    width: '100%',
    height: undefined,
    aspectRatio: 3 / 4,
    position: 'absolute',
  },
  line: {
    width: '100%',
    height: undefined,
    aspectRatio: 3 / 4,
    position: 'absolute',
    opacity: 1,
  },
  takeButton: {
    width: '20%',
    height: undefined,
    aspectRatio: 1 / 1,
    backgroundColor: 'rgba(220, 27, 15, 0.5)',
    borderRadius: 100,
  },
  circle: {
    flex: 1,
    backgroundColor: '#DC1B0F',
    borderRadius: 100,
    margin: 5,
  },
  cameraContainer: {
    backgroundColor: '#FFF',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
  },
  wrappers: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  hintImage: {
    width: '33%',
    height: undefined,
    aspectRatio: 3 / 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 10,
  },
  hintText: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: '#000',
  },
  hintButton: {
    backgroundColor: '#0E5CBE',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 30,
  },
  failedButton: {
    backgroundColor: '#D95B0D',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 30,
  },
  hintButtonTitle: {
    fontWeight: 'bold',
    color: '#FFF',
  },
  step: {
    fontSize: 24,
    color: '#FFF',
    fontFamily: Fonts.bold,
  },
  inputName: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginHorizontal: 20,
    paddingHorizontal: 20,
    marginVertical: 20,
    borderRadius: 20,
    paddingVertical: 16,
  },
  button: {
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#0F52BA',
    borderRadius: 20,
  },
  buttonTitle: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonCancel: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 15,
  },
  buttonCancelTitle: {
    fontWeight: 'bold',
  },
  direction: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  stepContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#195FBA',
    alignItems: 'center',
  },
  stepTxt: {
    fontSize: 16,
    fontFamily: Fonts.book,
    color: '#FFF',
  },
  left: {
    backgroundColor: '#FFF',
    width: '20%',
    height: undefined,
    aspectRatio: 1 / 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderRadius: 10,
    padding: 10,
  },
  switchCamera: {
    padding: 10,
  },
});
