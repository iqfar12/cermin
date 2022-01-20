import React, {createRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ActivityIndicator,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {Camera, requestCameraPermissionsAsync} from 'expo-camera';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import * as FaceDetector from 'expo-face-detector';
import {Svg, Defs, Mask, Rect, Circle} from 'react-native-svg';
import DashedProgress from '../../Component/DashedProgress';
import * as fs from 'expo-file-system';
import * as faceapi from 'face-api.js';
import {decodeJpeg} from '@tensorflow/tfjs-react-native';
import '../../../platform';
import {manipulateAsync} from 'expo-image-manipulator';
import {shuffleArr} from '../../Utils/Shuffle';

const CircleMask = () => {
  return (
    <Svg height="100%" width="100%">
      <Defs>
        <Mask id="mask" x="0" y="0" height="100%" width="100%">
          <Rect height="100%" width="100%" fill="#fff" />
          <Circle r="140" cx="50%" cy="45%" fill="black" />
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

const MainVerificationScreen = ({route}) => {
  const [camera, setCamera] = useState();
  const [progress, setProgress] = useState(0);
  const navigation = useNavigation();
  const [motionCount, setMotionCount] = useState(0);
  const isFocused = useIsFocused();
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [label, setLabel] = useState('');
  const [labelModal, setLabelModal] = useState(true);
  const [user, setUser] = useState([]);
  const [step, setStep] = useState(shuffleArr());
  const [faceId, setFaceId] = useState(0);

  const getUser = async () => {
    const users = await route.params?.user;
    setUser(users);
  };

  const condition4 = event => {
    const rightEye = event?.faces[0]?.rightEyeOpenProbability;
    const leftEye = event?.faces[0]?.leftEyeOpenProbability;
    if (rightEye < 0.06 && leftEye < 0.06) {
      setMotionCount(motionCount + 1);
    }
  };

  const condition1 = event => {
    const basePosition = event?.faces[0]?.noseBasePosition.x;
    if (basePosition <= 140) {
      setMotionCount(motionCount + 1);
    }
  };

  const condition2 = event => {
    const basePosition = event?.faces[0]?.noseBasePosition.x;
    if (basePosition >= 250) {
      setMotionCount(motionCount + 1);
    }
  };

  const condition3 = event => {
    const mouth = event?.faces[0]?.smilingProbability;
    if (mouth > 0.9) {
      setMotionCount(motionCount + 1);
    }
  };

  const randomize = () => {
    setStep(shuffleArr());
    // console.log(step, 'steps');
    setMotionCount(0);
    setProgress(0);
  };

  useEffect(() => {
    let timeout = setTimeout(() => {
      randomize();
    }, 10000);

    return () => clearTimeout(timeout);
  }, [step]);

  useEffect(() => {
    setLoad(true);
    getUser();
    return () => {
      setCamera();
      setLoad(false);
      setReady(false);
      setProgress(0);
    };
  }, []);

  const renderName = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.8}
        onPress={() => {
          setLabelModal(false);
          setLabel(item);
        }}
        style={styles.button}
      >
        <Text style={styles.buttonTitle}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const showModal = () => {
    if (labelModal) {
      return (
        <Modal transparent visible={labelModal}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={styles.modalContainer}
          >
            <View style={styles.wrapper}>
              <Text style={styles.pickerTitle}>Pilih User</Text>
              {route.params !== undefined && (
                <FlatList
                  data={user}
                  renderItem={renderName}
                  keyExtractor={(_, idx) => idx.toString()}
                />
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      );
    }
  };

  const RecognitionOffline = async (image, gambar) => {
    // const res = {
    //   _distance: 0.38753125995316545,
    //   _label: 'Iqfar',
    // };
    // return res;
    await faceapi.tf.ready();
    const userJsonPath = fs.documentDirectory + 'User.json';
    const jsonString = await fs.readAsStringAsync(userJsonPath);
    const userData = JSON.parse(jsonString).filter(item => item.label == label);
    const img = faceapi.tf.util.encodeString(image, 'base64').buffer;
    const raw = new Uint8Array(img);
    const imageTensor = decodeJpeg(raw);

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
      console.log(descriptors);
      const faceMatcher = new faceapi.FaceMatcher(descriptors, 0.43);
      const results = faceMatcher.findBestMatch(detection.descriptor);
      console.log(results, 'xxx', results._label == label);
      if (results._label != 'unknown' && results._label == label) {
        setIsLoading(false);
        navigation.navigate('Preview Verification', {
          data: {
            label: results._label,
          },
          image: gambar,
          label,
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
    navigation.navigate('Preview Verification', {
      data: undefined,
      image,
    });
  };

  const takePicture = async () => {
    if (!camera) return;
    const option = {
      quality: 0.5,
    };
    try {
      const image = await camera.takePictureAsync({base64: true});
      if (image) {
        setProgress(0);
        setLoad(false);
        const resize = {width: image.width / 5, height: image.height / 5};
        const results = await manipulateAsync(image.uri, [{resize}], {
          base64: true,
        });
        await RecognitionOffline(results.base64, results);
      }
    } catch (error) {
      console.log(error, 'verifiy');
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
    setProgress(motionCount * 25);
    if (motionCount > 3) {
      console.log(motionCount, 'motion');
      takePicture();
    }
  }, [motionCount]);

  const wording = val => {
    if (val === 0) {
      return 'Hadapkan wajah 15 derajat ke kiri';
    } else if (val === 1) {
      return 'Hadapkan wajah 15 derajat ke kanan';
    } else if (val === 2) {
      return 'Tersenyum';
    } else {
      return 'Kedipkan Mata';
    }
  };

  return (
    <>
      {showModal()}
      <StatusBar backgroundColor={'#0E5CBE'} />
      <View style={styles.header}>
        <Icon
          name={'arrow-left'}
          size={25}
          color={'#F0F2F2'}
          style={styles.back}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>Verifikasi Wajah</Text>
      </View>
      {load && !labelModal ? (
        <View style={styles.body}>
          <Text style={styles.topTitle}>
            Posisikan dan Tahan Wajah Anda Sampai Bar penuh
          </Text>
          <Camera
            ref={ref => {
              setCamera(ref);
            }}
            style={styles.preview}
            type={'front'}
            ratio={'4:3'}
            faceDetectorSettings={{
              mode: FaceDetector.FaceDetectorMode.fast,
              detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
              runClassifications: FaceDetector.FaceDetectorClassifications.none,
              minDetectionInterval: 100,
              tracking: true,
            }}
            onCameraReady={ready => setReady(true)}
            onMountError={err => console.log(err, 'error mount')}
            onFacesDetected={ready ? onFacesDetected : null}
          >
            <CircleMask />
          </Camera>
          <View style={styles.dashedContainer}>
            <DashedProgress progress={progress} />
          </View>
          <View style={styles.mask}>
            <Text style={styles.stepDetail}>
              {wording(step[motionCount])} dan tahan posisi tersebut beberapa
              detik
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <ActivityIndicator size={'large'} color={'#000'} />
        </View>
      )}
    </>
  );
};

export default MainVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#0E5CBE',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    position: 'relative',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  back: {
    position: 'absolute',
    left: 0,
    padding: 16,
    alignSelf: 'center',
  },
  body: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: '#FFF',
    position: 'relative',
  },
  preview: {
    aspectRatio: 3 / 4,
  },
  topTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 20,
    position: 'absolute',
    zIndex: 10,
    top: 0,
    alignSelf: 'center',
    marginTop: 20,
  },
  imageHintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  imageHint: {
    width: '33%',
    height: undefined,
    aspectRatio: 1 / 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mask: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 50,
    position: 'absolute',
    bottom: 0,
  },
  step: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  stepDetail: {
    color: '#888888',
    textAlign: 'center',
  },
  dashedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    top: 0,
    marginTop: 120,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  wrapper: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
  },
  inputName: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginHorizontal: 20,
    paddingHorizontal: 20,
    marginVertical: 20,
    borderRadius: 20,
    paddingVertical: 10,
  },
  button: {
    marginHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0F52BA',
    borderRadius: 20,
  },
  buttonTitle: {
    fontSize: 16,
    color: '#000',
  },
  pickerTitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 15,
  },
});
