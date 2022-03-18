import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Modal,
  Image,
  AppState,
  BackHandler,
} from 'react-native';
import { Camera, requestCameraPermissionsAsync } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { Svg, Defs, Mask, Rect, Circle } from 'react-native-svg';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { Endpoint } from '../../Utils/Endpoint';
import * as fs from 'react-native-fs';
import * as faceapi from 'face-api.js';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import '../../../platform';
import LoadingModal from '../../Component/LoadingModal';
import { manipulateAsync } from 'expo-image-manipulator';
import { shuffleArr } from '../../Utils/Shuffle';
import { FrontFrame, FrontLine, GuideFront } from '../../assets';
import ExpoIcon from '@expo/vector-icons/MaterialIcons';
import { Fonts } from '../../Utils/Fonts';
import TaskServices from '../../Database/TaskServices';
import geolocation from '@react-native-community/geolocation';
import NotFoundModal from '../../Component/NotFoundModal';

const CircleMask = () => {
  return (
    <Svg height="100%" width="100%">
      <Defs>
        <Mask id="mask" x="0" y="0" height="100%" width="100%">
          <Rect height="100%" width="100%" fill="#fff" />
          <Rect height="90%" width="85%" x="8.5%" y="8%" fill="black" ry="160" rx="160" />
          {/* <Circle r="30%" cx="50%" cy="40%" fill="black" /> */}
        </Mask>
      </Defs>
      <Rect
        height="100%"
        width="100%"
        fill="rgba(255, 255, 255, 1)"
        mask="url(#mask)"
        fill-opacity="0"
      />
    </Svg>
  );
};

const MainVerificationScreen = ({ route }) => {
  const pathSsd = fs.DocumentDirectoryPath + '/ssd_model';
  const pathFaceLandmarks = fs.DocumentDirectoryPath + '/face_landmark_model';
  const pathFaceRecognition = fs.DocumentDirectoryPath + '/face_recognition_model';
  const pathTiny = fs.DocumentDirectoryPath + '/tiny_model';
  const [camera, setCamera] = useState();
  const [ready, setReady] = useState(false);
  const [isMotion, setIsMotion] = useState(false);
  const [motionCount, setMotionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTake, setTake] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [step, setStep] = useState(shuffleArr([2, 3, 2, 3]));
  const [front, setFront] = useState(true);
  const MasterEmployee = TaskServices.getAllData('TM_EMPLOYEE');
  const [coordinate, setCoordinate] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [focus, setFocus] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const Employee = useMemo(() => {
    const res = MasterEmployee.find((item) => item.EMPLOYEE_NIK.split('/').join('') == route.params?.nik.split('/').join(''))
    if (res) {
      return res
    }
    return undefined
  }, [MasterEmployee, route.params])

  useEffect(() => {
    if (Employee === undefined) {
      setNotFound(true)
    } else {
      setNotFound(false)
    }
  }, [Employee])

  useEffect(() => {
    const onChangeState = () => {
      if (AppState.currentState === 'active') {
        setFocus(true);
      } else {
        setReady(false);
        setFocus(false);
      }
    }

    AppState.addEventListener('change', onChangeState)

    return () => AppState.removeEventListener('change', onChangeState)
  }, [])

  useEffect(() => {
    const onBackHandler = () => {
      navigation.navigate('Home')
      return true
    }

    BackHandler.addEventListener('hardwareBackPress', onBackHandler)

    return () => BackHandler.removeEventListener('hardwareBackPress', onBackHandler)
  }, [])

  useEffect(() => {
    geolocation.getCurrentPosition((res) => {
      setCoordinate({
        latitude: res.coords.latitude,
        longitude: res.coords.longitude
      })
    }, (err) => console.log('err Location'), {
      enableHighAccuracy: true
    })
  }, [isFocused])

  const user = TaskServices.getCurrentUser();
  const Descriptor = useMemo(() => {
    const res = MasterEmployee.filter((item) => item.FACE_DESCRIPTOR !== null)
    const location = user.LOCATION.split(',');
    let data = res;
    return data.map((item) => JSON.parse(item.FACE_DESCRIPTOR))
  }, [MasterEmployee]);

  const condition4 = event => {
    const rightEye = event?.faces[0]?.rightEyeOpenProbability;
    const leftEye = event?.faces[0]?.leftEyeOpenProbability;
    if (rightEye < 0.06 && leftEye < 0.06 && !isTake) {
      setTake(true);
      setIsMotion(true);
      setMotionCount(motionCount + 1);
    }
  };

  const condition1 = event => {
    const basePosition = event?.faces[0]?.NOSE_BASE?.x;
    if (basePosition <= 140) {
      setIsMotion(true);
      setMotionCount(motionCount + 1);
    }
  };

  const condition2 = event => {
    const basePosition = event?.faces[0]?.NOSE_BASE?.x;
    if (basePosition >= 250) {
      setIsMotion(true);
      setMotionCount(motionCount + 1);
    }
  };

  const condition3 = event => {
    const mouth = event?.faces[0]?.smilingProbability;
    if (mouth > 0.9) {
      setIsMotion(true);
      setMotionCount(motionCount + 1);
    }
  };

  const onFacesDetected = event => {
    let val = step[motionCount];
    if (motionCount === 0) {
      if (val === 0) {
        condition1(event);
      } else if (val === 1) {
        condition2(event);
      } else if (val === 2) {
        condition3(event);
      } else {
        condition4(event);
      }
    }
  };

  useEffect(() => {
    if (motionCount > 0) {
      setTimeout(() => {
        takePicture();
      }, 2500)
    }
  }, [motionCount]);

  const randomize = () => {
    setStep(shuffleArr([2, 3, 2, 3]));
    setMotionCount(0);
  };

  useEffect(() => {
    let timeout = setTimeout(() => {
      randomize();
    }, 7000);

    return () => clearTimeout(timeout);
  }, [step]);

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  // Use a lookup table to find the index.
  const lookup = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  const decode = (base64) => {
    let bufferLength = base64.length * 0.75,
      len = base64.length,
      i,
      p = 0,
      encoded1,
      encoded2,
      encoded3,
      encoded4;

    if (base64[base64.length - 1] === '=') {
      bufferLength--;
      if (base64[base64.length - 2] === '=') {
        bufferLength--;
      }
    }

    const arraybuffer = new ArrayBuffer(bufferLength),
      bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i += 4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i + 1)];
      encoded3 = lookup[base64.charCodeAt(i + 2)];
      encoded4 = lookup[base64.charCodeAt(i + 3)];

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };

  const fetchData = async () => {
    console.log('downloaded model')
    const tinyFile = await fs.readFile(pathTiny, 'base64');
    const ssdFile = await fs.readFile(pathSsd, 'base64');
    const landmarkFile = await fs.readFile(pathFaceLandmarks, 'base64');
    const recognitionFile = await fs.readFile(pathFaceRecognition, 'base64');

    const tinyBuffer = decode(tinyFile);
    const ssdBuffer = decode(ssdFile);
    const landmarkBuffer = decode(landmarkFile);
    const recognitionBuffer = decode(recognitionFile);

    const tinyWeight = new Float32Array(tinyBuffer);
    const ssdWeight = new Float32Array(ssdBuffer);
    const landmarkWeight = new Float32Array(landmarkBuffer);
    const recognitionWeight = new Float32Array(recognitionBuffer);

    try {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.load(ssdWeight),
        faceapi.nets.faceLandmark68Net.load(landmarkWeight),
        faceapi.nets.tinyFaceDetector.load(tinyWeight),
        faceapi.nets.faceRecognitionNet.load(recognitionWeight),
      ]);
      console.log(
        faceapi.nets.ssdMobilenetv1._name,
        faceapi.nets.faceLandmark68Net.getDefaultModelName(),
        faceapi.nets.faceRecognitionNet.getDefaultModelName(),
        faceapi.nets.tinyFaceDetector.getDefaultModelName(),
      );
    } catch (error) {
      console.log(error, 'error network');
    }
    setIsLoading(false);

    console.log(
      faceapi.nets.ssdMobilenetv1.isLoaded,
      faceapi.nets.faceLandmark68Net.isLoaded,
      faceapi.nets.faceRecognitionNet.isLoaded,
      faceapi.nets.tinyFaceDetector.isLoaded,
    );
  };

  const loadModel = async () => {
    if (
      !faceapi.nets.ssdMobilenetv1.isLoaded &&
      !faceapi.nets.faceLandmark68Net.isLoaded &&
      !faceapi.nets.faceRecognitionNet.isLoaded &&
      !faceapi.nets.tinyFaceDetector.isLoaded
    ) {
      const model =
        'https://faceapimodel.oss-ap-southeast-5.aliyuncs.com/weights';
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(model),
          faceapi.nets.faceLandmark68Net.loadFromUri(model),
          faceapi.nets.faceRecognitionNet.loadFromUri(model),
          faceapi.nets.tinyFaceDetector.loadFromUri(model),
        ]);
        console.log(
          faceapi.nets.ssdMobilenetv1._name,
          faceapi.nets.faceLandmark68Net.getDefaultModelName(),
          faceapi.nets.faceRecognitionNet.getDefaultModelName(),
          faceapi.nets.tinyFaceDetector.getDefaultModelName(),
        );
      } catch (error) {
        console.log(error, 'error network');
      }
      setIsLoading(false);

      console.log(
        faceapi.nets.ssdMobilenetv1.isLoaded,
        faceapi.nets.faceLandmark68Net.isLoaded,
        faceapi.nets.faceRecognitionNet.isLoaded,
        faceapi.nets.tinyFaceDetector.isLoaded,
      );
    }
  };

  const isReady = async () => {
    await faceapi.tf.ready().finally(async () => {

      console.log(faceapi.tf.getBackend());
      const isSSDExist = await fs.exists(pathSsd);
      const isLandmarkExist = await fs.exists(pathFaceLandmarks);
      const isFaceRecognition = await fs.exists(pathFaceRecognition);
      const isTinyExist = await fs.exists(pathTiny);
      if (!isFaceRecognition || !isLandmarkExist || !isSSDExist || !isTinyExist) {
        await loadModel();
      } else {
        await fetchData();
      }
    });
  }

  useEffect(() => {
    isReady();
  }, [])

  const RecognitionOffline = async (image, gambar) => {
    try {
      await faceapi.tf.ready()
      const img = faceapi.tf.util.encodeString(image, 'base64').buffer;
      const raw = new Uint8Array(img);
      const imageTensor = decodeJpeg(raw);

      console.log('detecting....');
      const detection = await faceapi
        .detectSingleFace(
          imageTensor,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 416,
            scoreThreshold: 0.43,
          }),
        )
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (detection) {
        const descriptors = Descriptor.map(item =>
          faceapi.LabeledFaceDescriptors.fromJSON(item),
        );
        const faceMatcher = new faceapi.FaceMatcher(descriptors, 0.43);
        const results = faceMatcher.findBestMatch(detection.descriptor);
        console.log(results);
        if (results._label != 'unknown') {
          setIsLoading(false);
          console.log(results);
          navigation.replace('Preview Verification', {
            data: {
              label: results._label,
              accuracy: results._distance,
              coord: coordinate
            },
            image: gambar,
          });
        } else {
          unknownRedirect(gambar);
        }
      } else {
        unknownRedirect(gambar);
      }
    } catch (error) {
      unknownRedirect(gambar)
    }

  };

  const unknownRedirect = image => {
    setIsLoading(false);
    navigation.navigate('Preview Verification', {
      data: undefined,
      image,
    });
  };

  const takePicture = async () => {
    if (!camera) return;
    const image = await camera.takePictureAsync();
    if (image) {
      setIsLoading(true);
      const resize = { width: image.width / 5, height: image.height / 5 };
      const results = await manipulateAsync(image.uri, [{ resize }], {
        base64: true,
      });
      await RecognitionOffline(results.base64, image);
    }
  };

  const onPressNotFoundModal = async () => {
    setNotFound(false);
  }

  const showModal = () => {
    if (isLoading) {
      return <LoadingModal />;
    }
    if (notFound) {
      return (
        <NotFoundModal
          visible={notFound}
          title={'Data Karwayan Tidak Ditemukan'}
          content={'Data Karyawan yang akan anda validasi tidak ditemukan\nSilahkan untuk mencek login akun dan Sync Ulang pada aplikasi Cermin'}
          onPress={onPressNotFoundModal} />
      )

    }
  };

  const wording = val => {
    if (val === 0) {
      return 'Hadapkan wajah ke kiri';
    } else if (val === 1) {
      return 'Hadapkan wajah ke kanan';
    } else if (val === 2) {
      return 'Tersenyum';
    } else {
      return 'Kedipkan Mata';
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {showModal()}
      <StatusBar backgroundColor={'#0E5CBE'} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon
            name={'chevron-left'}
            size={25}
            color={'#FFF'}
            style={styles.back}
            onPress={() => navigation.goBack()}
          />
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
            <Text style={styles.title}>Kembali</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.personContainer}>
          <Text style={styles.personName}>{Employee?.EMPLOYEE_FULLNAME}</Text>
          <View style={styles.nikContainer}>
            <Text style={styles.nik}>{Employee?.EMPLOYEE_NIK}</Text>
            <Text style={styles.nik}> | </Text>
            <View style={styles.nikContainer}>
              <ExpoIcon
                name={'place'}
                size={20}
                color={'#FFF'}
              />
              <Text style={styles.nik}>{Employee?.WERKS}</Text>
            </View>
          </View>
        </View>
        {isFocused && focus ? (
          <View style={styles.wrapper}>
            <Camera
              ref={ref => {
                setCamera(ref);
              }}
              style={styles.preview}
              type={front ? 'front' : 'back'}
              ratio={'4:3'}
              faceDetectorSettings={{
                mode: 2,
                detectLandmarks: 2,
                runClassifications: 2,
                minDetectionInterval: 500,
                tracking: true,
              }}
              onCameraReady={() => setReady(true)}
              onMountError={err => console.log(err, 'error mount')}
            // onFacesDetected={ready && focus && !isLoading ? onFacesDetected : null}
            >
              <Image style={styles.frame} source={FrontFrame} />
            </Camera>
          </View>
        ) : null}
        <View style={styles.body}>
          <View style={styles.hintImage}>
            <Image style={styles.image} source={GuideFront} />
          </View>
          <View style={styles.subContainer}>
            <Text style={styles.subTitle}>
              {motionCount > 0 ? 'Lihat Ke Arah Kamera' : wording(step[motionCount])}
            </Text>
            <Text style={styles.subText}>Pastikan mata melihat kamera</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MainVerificationScreen;

const styles = StyleSheet.create({
  preview: {
    aspectRatio: 3 / 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    position: 'relative',
  },
  masking: {
    aspectRatio: 1 / 1,
    width: '75%',
    height: undefined,
  },
  mask: {
    position: 'absolute',
    alignItems: 'center',
    borderRadius: 200,
    borderWidth: 5,
    alignSelf: 'center',
    top: 0,
    marginTop: 164,
  },
  round: {
    width: '42%',
    height: undefined,
    aspectRatio: 1 / 1,
    borderRadius: 100,
  },
  button: {
    borderWidth: 3,
    borderColor: '#0E5CBE',
    borderRadius: 100,
    padding: 5,
    backgroundColor: '#FFF',
  },
  buttonContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 0,
    marginBottom: -25,
  },
  subTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#6C6C6C'
  },
  header: {
    backgroundColor: '#195FBA',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    position: 'relative',
  },
  back: {
    position: 'absolute',
    left: 0,
    padding: 16,
    alignSelf: 'center',
  },
  switch: {
    position: 'absolute',
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignSelf: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    marginLeft: 50,
  },
  frame: {
    width: '100%',
    height: undefined,
    aspectRatio: 3 / 4,
    position: 'absolute',
  },
  hintImage: {
    width: '20%',
    height: undefined,
    aspectRatio: 1 / 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    paddingRight: 20
  },
  image: {
    flex: 1,
    resizeMode: 'contain'
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#C5C5C5',
    paddingTop: 20,
    justifyContent: 'center',
  },
  personContainer: {
    backgroundColor: '#195FBA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  personName: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: '#FFF',
  },
  nikContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nik: {
    fontFamily: Fonts.book,
    fontSize: 18,
    color: '#FFF',
  },
  subText: {
    fontFamily: Fonts.book,
    fontSize: 16,
    color: '#6C6C6C',
  }
});
