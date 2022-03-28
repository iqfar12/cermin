import React, { useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, PermissionsAndroid, Linking } from 'react-native';
import LottieView from 'lottie-react-native';
import { Splash } from '../../assets';
import { Fonts } from '../../Utils/Fonts';
import TaskServices from '../../Database/TaskServices';
import { useNavigation } from '@react-navigation/native';
import * as faceapi from 'face-api.js';
import { requestCameraPermissionsAsync } from 'expo-camera';
import '@tensorflow/tfjs-react-native';
// import '../../../platform';
import fs from 'react-native-fs';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob'
import { requestAdvanceStoragePermission, lockTimezone } from '../../Utils/StoragePermisssion';

const SplashScreen = () => {
  const user = TaskServices.getCurrentUser();
  const navigation = useNavigation();
  const pathSsd = fs.DocumentDirectoryPath + '/ssd_model';
  const pathFaceLandmarks = fs.DocumentDirectoryPath + '/face_landmark_model';
  const pathFaceRecognition = fs.DocumentDirectoryPath + '/face_recognition_model';
  const pathTiny = fs.DocumentDirectoryPath + '/tiny_model';

  const handleLinking = (event) => {
    console.log(event);
  }

  useEffect(() => {
    Linking.addEventListener('url', handleLinking)
  }, []);

  const isReady = async () => {
    await faceapi.tf.ready().finally(async () => {
      console.log(faceapi.tf.getBackend());
      const isSSDExist = await fs.exists(pathSsd);
      const isLandmarkExist = await fs.exists(pathFaceLandmarks);
      const isFaceRecognition = await fs.exists(pathFaceRecognition);
      const isTinyExist = await fs.exists(pathTiny);
      if (!isFaceRecognition || !isLandmarkExist || !isSSDExist || !isTinyExist) {
        // await onDownloadDataModel();
        await loadModel();
      } else {
        await fetchData();
      }
      await checkLogin();
    });
  };


  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  // Use a lookup table to find the index.
  const lookup = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  const decode = (base64: string): ArrayBuffer => {
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

  const encode = (arraybuffer: ArrayBuffer): string => {
    let bytes = new Uint8Array(arraybuffer),
      i,
      len = bytes.length,
      base64 = '';

    for (i = 0; i < len; i += 3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if (len % 3 === 2) {
      base64 = base64.substring(0, base64.length - 1) + '=';
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + '==';
    }

    return base64;
  };

  const onDownloadDataModel = async () => {
    console.log('download model');
    const urlSsd =
      'https://github.com/justadudewhohacks/face-api.js-models/raw/master/uncompressed/ssd_mobilenetv1.weights';
    const urlFaceLandmark =
      'https://github.com/justadudewhohacks/face-api.js-models/raw/master/uncompressed/face_landmark_68_model.weights';
    const urlFaceRecognition =
      'https://github.com/justadudewhohacks/face-api.js-models/raw/master/uncompressed/face_recognition_model.weights';
    const urlTiny =
      'https://github.com/justadudewhohacks/face-api.js-models/raw/master/uncompressed/tiny_face_detector_model.weights';
    const ssd = await axios.get(urlSsd, { responseType: 'arraybuffer' });
    const base64Ssd = encode(ssd.data);
    await fs
      .writeFile(pathSsd, base64Ssd, 'base64')
      .then(() => console.log('succes write ssd'));

    const faceLandmark = await axios.get(urlFaceLandmark, { responseType: 'arraybuffer' });
    const base64FaceLandmark = encode(faceLandmark.data)
    await fs
      .writeFile(pathFaceLandmarks, base64FaceLandmark, 'base64')
      .then(() => console.log('succes write face landmark'));

    const faceRecognition = await axios.get(urlFaceRecognition, {responseType: 'arraybuffer'});
    const base64FaceRecognition = encode(faceRecognition.data);
    await fs
      .writeFile(pathFaceRecognition, base64FaceRecognition, 'base64')
      .then(() => console.log('succes write face recognition'));

    const tiny = await axios.get(urlTiny, {responseType: 'arraybuffer'});
    const base64Tiny = encode(tiny.data);
    await fs
      .writeFile(pathTiny, base64Tiny, 'base64')
      .then(() => console.log('succes write Tiny Ssd'));
  }

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

    console.log(
      faceapi.nets.ssdMobilenetv1.isLoaded,
      faceapi.nets.faceLandmark68Net.isLoaded,
      faceapi.nets.faceRecognitionNet.isLoaded,
      faceapi.nets.tinyFaceDetector.isLoaded,
    );
    // const base64 = await fs.readFile(path, 'base64');
    // console.log(base64);
    // const asset = await fs.existsAssets('model')
    // const listassets = await fs.readDirAssets('model');
    // await fs.copyFileAssets('weights', path);
    // console.log(path, 'path');
    // console.log(listassets[0].path, 'asset');
    // const asset = await fs.readFileAssets(listassets[0].path, 'base64');
    // console.log(asset);
    // const arraybuffer = decode(asset);
    // const weights = new Float32Array(arraybuffer);
    // console.log(weights);
    // const res = await axios.get(url, {responseType: 'arraybuffer'});
    // const base64 = encode(res.data);
    // const arraybuffer = decode(base64);
    // console.log(res.data);
    // const weights = new Float32Array(arraybuffer);
    // await fs
    //   .writeFile(path, base64, 'base64')
    //   .then(() => console.log('succes write'));
    // const res = await faceapi.fetchNetWeights('https://github.com/justadudewhohacks/face-api.js-models/blob/master/uncompressed/ssd_mobilenetv1.weights')
    // console.log(res.buffer);
    // await faceapi.nets.ssdMobilenetv1.load(weights);
    // console.log(faceapi.nets.ssdMobilenetv1.isLoaded, 'isLoaded');
  };

  const getPermission = async () => {
    await requestCameraPermissionsAsync();
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    await requestAdvanceStoragePermission();
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

      console.log(
        faceapi.nets.ssdMobilenetv1.isLoaded,
        faceapi.nets.faceLandmark68Net.isLoaded,
        faceapi.nets.faceRecognitionNet.isLoaded,
        faceapi.nets.tinyFaceDetector.isLoaded,
      );
    }
  };

  const initDir = async () => {
    const localPath = fs.ExternalDirectoryPath + '/Local';
    await fs.mkdir(localPath);
    const imagesPath = localPath + '/Images';
    await fs.mkdir(imagesPath);
  };

  useEffect(() => {
    isReady();
    getPermission();
    initDir();
  }, []);

  const checkLogin = async () => {
    console.log(user, 'user');
    if (user !== undefined && user.ACCESS_TOKEN !== null) {
      navigation.replace('Home');
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#FFF'} />
      <LottieView source={Splash} autoPlay={true} loop={true} autoSize={true} />
      <Text style={styles.title}>Face Recognition</Text>
      <Text style={styles.copyright}>©copyright by Triputra Agro Persada </Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  splash: {
    width: '100%',
    height: undefined,
    aspectRatio: 1 / 1,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#2A61AD',
  },
  copyright: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 35,
  },
});
