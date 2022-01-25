import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Modal,
  Image,
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

const AttendanceRest = ({ route }) => {
  const [camera, setCamera] = useState();
  const [ready, setReady] = useState(false);
  const [isMotion, setIsMotion] = useState(false);
  const [motionCount, setMotionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isTake, setTake] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [step, setStep] = useState(shuffleArr());
  const [faceId, setFaceId] = useState(0);
  const [front, setFront] = useState(true);

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
    if (val === 0) {
      condition1(event);
    } else if (val === 1) {
      condition2(event);
    } else if (val === 2) {
      condition3(event);
    } else {
      condition4(event);
    }

    const faceID = event?.faces[0]?.faceID;
    if (faceId !== faceID) {
      // setIsMotion(false);
      // setMotionCount(0);
      randomize();
    }
    setFaceId(faceID);
  };

  useEffect(() => {
    if (motionCount > 3) {
      console.log(motionCount, 'motion');
      takePicture();
    }
  }, [motionCount]);

  const randomize = () => {
    setStep(shuffleArr());
    // console.log(step, 'steps');
    setMotionCount(0);
  };

  useEffect(() => {
    let timeout = setTimeout(() => {
      randomize();
    }, 10000);

    return () => clearTimeout(timeout);
  }, [step]);

  const RecognitionOffline = async (image, gambar) => {
    // const res = {
    //   _distance: 0.38753125995316545,
    //   _label: 'Iqfar',
    // };
    // return res;
    await faceapi.tf.ready();

    const userJsonPath = fs.documentDirectory + 'User.json';
    const jsonString = await fs.readAsStringAsync(userJsonPath);
    const userData = JSON.parse(jsonString);
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
      const descriptors = userData.map(item =>
        faceapi.LabeledFaceDescriptors.fromJSON(item),
      );
      const faceMatcher = new faceapi.FaceMatcher(descriptors, 0.43);
      const results = faceMatcher.findBestMatch(detection.descriptor);
      console.log(results);
      if (results._label != 'unknown') {
        setIsLoading(false);
        navigation.navigate('Preview Attendance Rest', {
          data: {
            label: results._label,
          },
          image: gambar,
        });
      } else {
        unknownRedirect(gambar);
      }
    } else {
      unknownRedirect(gambar);
    }
  };

  const unknownRedirect = image => {
    setIsLoading(false);
    navigation.navigate('Preview Attendance Rest', {
      data: undefined,
      image,
    });
  };

  const takePicture = async () => {
    if (!camera) return;
    const image = await camera.takePictureAsync({ base64: true });
    if (image) {
      setIsLoading(true);
      const resize = { width: image.width / 5, height: image.height / 5 };
      const results = await manipulateAsync(image.uri, [{ resize }], {
        base64: true,
      });
      // console.log(results.uri, results.height, results.width);
    //   if (online) {
        recognizeOnline(results);
    //   } else {
    //     await RecognitionOffline(results.base64, results);
    //   }
    }
  };

  const showModal = () => {
    if (isLoading) {
      return <LoadingModal />;
    }
  };

  const recognizeOnline = async image => {
    let formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      type: 'image/jpeg',
      name: 'images.jpg',
    });

    try {
      const res = await axios.post(Endpoint.Recognize, formData, {
        headers: {
          Accept: 'multipart/form-data',
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res) {
        console.log(res.data);
        navigation.navigate('Preview Attendance Rest', {
          data: res.data,
          image: image,
        });
      }
    } catch (error) {
      console.log(error.response, 'error');
      navigation.navigate('Preview Attendance Rest', {
        data: undefined,
        image: image,
      });
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
    <View style={{flex: 1}}>
      {showModal()}
      <StatusBar backgroundColor={'#FFB81C'} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon
            name={'chevron-left'}
            size={25}
            color={'#6C6C6C'}
            style={styles.back}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>Kembali</Text>
          <ExpoIcon
            name={'photo-camera'}
            size={25}
            color={'#FFB81C'}
            style={styles.switch}
            onPress={() => setFront(!front)} />
        </View>
        {isFocused ? (
          <View style={styles.wrapper}>
            <Camera
              ref={ref => {
                setCamera(ref);
              }}
              style={styles.preview}
              type={front ? 'front' : 'back'}
              ratio={'4:3'}
              faceDetectorSettings={{
                mode: FaceDetector.FaceDetectorMode.fast,
                detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                runClassifications: FaceDetector.FaceDetectorClassifications.none,
                minDetectionInterval: 100,
                tracking: true,
              }}
              onCameraReady={() => setReady(true)}
              onMountError={err => console.log(err, 'error mount')}
              onFacesDetected={ready ? onFacesDetected : null}
            >
              <CircleMask />
              <Image style={styles.frame} source={FrontFrame} />
              <Image style={styles.frame} source={FrontLine} />
            </Camera>
          </View>
        ) : null}
        <View style={styles.body}>
          <View style={styles.hintImage}>
              <Image style={styles.image} source={GuideFront} />
          </View>
          <Text style={styles.subTitle}>
            {wording(step[motionCount])}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AttendanceRest;

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
