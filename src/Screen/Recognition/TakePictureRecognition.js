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
import * as fs from 'expo-file-system';
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
import SoundPlayer from 'react-native-sound-player';


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

const TakePictureRecognition = ({ route }) => {
  const [camera, setCamera] = useState();
  const [ready, setReady] = useState(false);
  const [isMotion, setIsMotion] = useState(false);
  const [motionCount, setMotionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isTake, setTake] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [step, setStep] = useState(shuffleArr([2, 3, 2, 3]));
  const [faceId, setFaceId] = useState(0);
  const [front, setFront] = useState(true);
  const MasterEmployee = TaskServices.getAllData('TM_EMPLOYEE');
  const [coordinate, setCoordinate] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [focus, setFocus] = useState(true);

  useEffect(() => {
    return () => setReady(false);
  }, [])

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
    if (user.REFERENCE_LOCATION == 'AFD') {
      data = res.filter((item) => location.includes(item?.AFD_CODE))
    } else if (user.REFERENCE_LOCATION == 'BA') {
      data = res.filter((item) => location.includes(item?.WERKS))
    } else if (user.REFERENCE_LOCATION == 'COMP') {
      data = res.filter((item) => location.includes(item?.COMP_CODE))
    } else {
      // TODO: HO Need Filter!!
      data = res
    }
    return data.map((item) => JSON.parse(item.FACE_DESCRIPTOR))
  }, [MasterEmployee]);

  const condition4 = event => {
    const rightEye = event?.faces[0]?.rightEyeOpenProbability;
    const leftEye = event?.faces[0]?.leftEyeOpenProbability;
    if (rightEye < 0.06 && leftEye < 0.06 && !isTake) {
      setTake(true);
      setIsMotion(true);
      setMotionCount(1);
    }
  };

  const condition1 = event => {
    const basePosition = event?.faces[0]?.NOSE_BASE?.x;
    if (basePosition <= 140) {
      setIsMotion(true);
      setMotionCount(1);
    }
  };

  const condition2 = event => {
    const basePosition = event?.faces[0]?.NOSE_BASE?.x;
    if (basePosition >= 250) {
      setIsMotion(true);
      setMotionCount(1);
    }
  };

  const condition3 = event => {
    const mouth = event?.faces[0]?.smilingProbability;
    if (mouth > 0.9 && !isTake) {
      setTake(true);
      setIsMotion(true);
      setMotionCount(1);
    }
  };

  const filename = () => {
    let val = step[motionCount];
    if (motionCount > 0) {
      return 'look_camera'
    }
    if (val === 0) {
      return 'look_left';
    } else if (val === 1) {
      return 'look_right';
    } else if (val === 2) {
      return 'smile';
    } else {
      return 'blink';
    }
  };

  useEffect(() => {
    if (isFocused && ready && !isTake) {
      if (motionCount > 0) {
        SoundPlayer.playSoundFile(filename(), 'mp3')
      } else {
        setTimeout(() => {
          SoundPlayer.playSoundFile(filename(), 'mp3')
        }, 1000)
      }
    }
  }, [isFocused, motionCount, step, ready])

  const onFacesDetected = event => {
    let val = step[motionCount];
    if (!isTake && motionCount === 0) {
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

    // const faceID = event?.faces[0]?.faceID;
    // if (faceId !== faceID) {
    //   // setIsMotion(false);
    //   // setMotionCount(0);
    //   randomize();
    // }
    // setFaceId(faceID);
  };

  useEffect(() => {
    if (motionCount > -1) {
      setTimeout(() => {
        takePicture();
      }, 2500)
    }
  }, [motionCount]);

  const randomize = () => {
    setStep(shuffleArr([2, 3, 2, 3]));
    // console.log(step, 'steps');
    setMotionCount(0);
  };

  useEffect(() => {
    let timeout = setTimeout(() => {
      randomize();
    }, 7000);

    return () => clearTimeout(timeout);
  }, [step]);

  const RecognitionOffline = async (image, gambar) => {
    // const res = {
    //   _distance: 0.38753125995316545,
    //   _label: 'Iqfar',
    // };
    // return res;
    try {
      await faceapi.tf.ready()
      const img = faceapi.tf.util.encodeString(image, 'base64').buffer;
      const raw = new Uint8Array(img);
      const imageTensor = decodeJpeg(raw);

      console.log('detecting....');
      const detection = await faceapi
        .detectSingleFace(
          imageTensor,
          // new faceapi.SsdMobilenetv1Options({
          //   minConfidence: 0.43,
          // })
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 608,
            scoreThreshold: 0.3,
          }),
        )
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (detection) {
        const descriptors = Descriptor.map(item =>
          faceapi.LabeledFaceDescriptors.fromJSON(item),
        );
        const faceMatcher = new faceapi.FaceMatcher(descriptors, 0.45);
        const results = faceMatcher.findBestMatch(detection.descriptor);
        console.log(results);
        if (results._label != 'unknown') {
          setIsLoading(false);
          console.log(results);
          navigation.replace('Preview Recognition', {
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
      console.log(error, 'error');
      unknownRedirect(gambar)
    }

  };

  const unknownRedirect = image => {
    setIsLoading(false);
    navigation.navigate('Preview Recognition', {
      data: undefined,
      image,
    });
  };

  const takePicture = async () => {
    if (isLoading) return;
    if (!camera) return;
    const image = await camera.takePictureAsync();
    if (image) {
      setIsLoading(true);
      const resize = { width: image.width / 5, height: image.height / 5 };
      const results = await manipulateAsync(image.uri, [{ resize }], {
        base64: true,
      });
      // // console.log(results.uri, results.height, results.width);
      // // if (online) {
      //   // recognizeOnline(results);
      // // } else {
      await RecognitionOffline(results.base64, image);
      // }
    }
  };

  const showModal = () => {
    if (isLoading) {
      return <LoadingModal />;
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

  const {ID, SOURCE} = TaskServices.getAllData('T_NAVIGATE')[0];
  return (
    <View style={{ flex: 1 }}>
      {showModal()}
      <StatusBar backgroundColor={'#0E5CBE'} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon
            name={'chevron-left'}
            size={25}
            color={'#6C6C6C'}
            style={styles.back}
            onPress={() => navigation.navigate('Home')}
          />
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate(SOURCE)}>
            <Text style={styles.title}>Kembali</Text>
          </TouchableOpacity>
          <ExpoIcon
            name={'photo-camera'}
            size={25}
            color={'#195FBA'}
            style={styles.switch}
            onPress={() => setFront(!front)} />
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
              onMountError={err => setReady(false)}
              onFacesDetected={ready && focus && isFocused ? onFacesDetected : null}
            >
              <CircleMask />
              <Image style={styles.frame} source={FrontFrame} />
              {/* <Image style={styles.frame} source={FrontLine} /> */}
            </Camera>
          </View>
        ) : null}
        <View style={styles.body}>
          <View style={styles.hintImage}>
            <Image style={styles.image} source={GuideFront} />
          </View>
          <Text style={styles.subTitle}>
            {motionCount > 0 ? 'Lihat Ke Arah Kamera' : wording(step[motionCount])}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TakePictureRecognition;

const styles = StyleSheet.create({
  preview: {
    aspectRatio: 3 / 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    position: 'relative',
    // marginTop: 30,
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
    backgroundColor: '#FFF',
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
    color: '#6C6C6C',
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
    width: '25%',
    height: undefined,
    aspectRatio: 1 / 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'contain'
  },
  body: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#C5C5C5',
    paddingTop: 20,
    marginTop: 10,
  }
});
