import React, {useEffect} from 'react';
import {StyleSheet, Text, View, StatusBar, PermissionsAndroid} from 'react-native';
import LottieView from 'lottie-react-native';
import {Splash} from '../../assets';
import {Fonts} from '../../Utils/Fonts';
import TaskServices from '../../Database/TaskServices';
import {useNavigation} from '@react-navigation/native';
import * as faceapi from 'face-api.js';
import {requestCameraPermissionsAsync} from 'expo-camera';
import '@tensorflow/tfjs-react-native';
import '../../../platform';
import fs from 'react-native-fs';
import axios from 'axios';

const SplashScreen = () => {
  console.log('splash');
  const user = TaskServices.getCurrentUser();
  const navigation = useNavigation();

  const isReady = async () => {
    await faceapi.tf.ready().finally(async () => {
      await loadModel();
      // await fetchData();
      await checkLogin();
    });
  };

  const fetchData = async () => {
    // const path = fs.DocumentDirectoryPath + '/weights/ssd';
    // const asset = await fs.existsAssets('weights')
    // await fs.copyFileAssets('weights', path);
    // console.log(path, 'path');
    // console.log(asset, 'asset');
    const url =
      'https://github.com/justadudewhohacks/face-api.js-models/raw/master/uncompressed/ssd_mobilenetv1.weights';
    const res = await axios.get(url, {responseType: 'arraybuffer'});
    // console.log(res.data);
    const weights = new Float32Array(res.data);
    // await fs
    //   .writeFile(path, weights, 'ascii')
    //   .then(() => console.log('succes write'));
    // const res = await faceapi.fetchNetWeights('https://github.com/justadudewhohacks/face-api.js-models/blob/master/uncompressed/ssd_mobilenetv1.weights')
    // console.log(res.buffer);
    await faceapi.nets.ssdMobilenetv1.load(weights);
    console.log(faceapi.nets.ssdMobilenetv1.isLoaded);
  };

  const getPermission = async () => {
    await requestCameraPermissionsAsync();
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
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
    if (user === undefined) {
      navigation.replace('Login');
    } else {
      navigation.replace('Home');
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
