import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  Modal,
  Linking,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as faceapi from 'face-api.js';
import '@tensorflow/tfjs-react-native';
import '../../../platform';
import * as fs from 'expo-file-system';
import axios from 'axios';
import {Endpoint} from '../../Utils/Endpoint';
import {RecognitionOffline} from '../../Utils/RecognitionOffline';
import {Camera, requestCameraPermissionsAsync} from 'expo-camera';
import * as IntentLauncher from 'expo-intent-launcher';
import TaskServices from '../../Database/TaskServices';
import HeaderHome from './HeaderHome';
import HomeTabNavigator from './HomeTabNavigator';
import HomeContent from './HomeContent';
import SyncNotif from '../../Component/SyncNotif';
import moment from 'moment';
import NoConnectionModal from '../../Component/NoConnectionModal';
import WarningModal from '../../Component/WarningModal';
import SuccessModal from '../../Component/SuccessModal';
import { dateGenerator } from '../../Utils/DateConverter';
import { checkTimezoneSetting } from '../../Utils/StoragePermisssion';

moment.locale('id');
const HomeScreen = ({route}) => {
  const [sync, setSync] = useState(false);
  const [status, setStatus] = useState({
    loading: true,
    message: '',
  });
  const getDataset = async () => {
    let data = [];
    try {
      const res = await axios.get(
        Endpoint.GetDataset + '?query={"limit":1000}',
      );
      if (res) {
        data = res.data.data;
        setStatus({
          ...status,
          loading: false,
          message: 'Sync Berhasil',
        });
        return data;
      }
    } catch (error) {
      console.log(error, 'error');
      setStatus({
        ...status,
        loading: false,
        message: 'Sync Gagal',
      });
      return data;
    }
  };

  useEffect(() => {
    if (route.params?.sync) {
      createJsonUser();
    }
  }, [route.params]);

  const createJsonUser = async () => {
    setSync(true);
    const dirPath = fs.documentDirectory;
    const UserJsonPath = dirPath + 'User.json';
    const info = await fs.getInfoAsync(UserJsonPath);
    const data = await getDataset();
    const objectedData = data.map(item =>
      JSON.parse(item.labeledFaceDescriptors),
    );
    const write = await fs.writeAsStringAsync(
      UserJsonPath,
      JSON.stringify(objectedData),
    );
    console.log(info, UserJsonPath);
  };

  const getUser = async () => {
    let res = [];
    try {
      const userJsonPath = fs.documentDirectory + 'User.json';
      const jsonString = await fs.readAsStringAsync(userJsonPath);
      const userData = JSON.parse(jsonString);
      res = userData.map(item => item.label);
    } catch (error) {
      console.log(error, 'error user');
    }
    return res;
  };

  const isReady = async () => {
    await faceapi.tf.ready().finally(async () => {
      await loadModel();
    });
  };

  const getPermission = async () => {
    await requestCameraPermissionsAsync();
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
          faceapi.nets.ssdMobilenetv1.isLoaded,
          faceapi.nets.faceLandmark68Net.isLoaded,
          faceapi.nets.faceRecognitionNet.isLoaded,
          faceapi.nets.tinyFaceDetector.isLoaded,
        );
      } catch (error) {
        console.log(error, 'error');
      }
    }
  };

  useEffect(() => {
    isReady();
    getPermission();
  }, []);

  const checkTimesetting = async () => {
    const res = await checkTimezoneSetting();
    console.log(res, 'time setting');
  }

  useEffect(() => {
    checkTimesetting();
  }, [])

  const showModal = () => {
    if (sync) {
      return (
        <Modal visible={true} transparent>
          <View style={styles.modal}>
            <View style={styles.wrapper}>
              {status.loading ? (
                <View>
                  <ActivityIndicator size={'large'} color={'#000'} />
                </View>
              ) : (
                <>
                  <Text style={styles.message}>{status.message}</Text>
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.8}
                    onPress={() => {
                      setSync(false);
                      setStatus({
                        ...status,
                        loading: false,
                        message: '',
                      });
                    }}
                  >
                    <Text style={styles.buttonTitle}>Oke</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      );
    }
  };

  const user = TaskServices.getAllData('TM_USERS')[0];

  const navigation = useNavigation();
  return (
    <>
      <StatusBar backgroundColor={'#195FBA'} />
      {showModal()}
      <View style={styles.container}>
        <HeaderHome
          User={user}
          onSync={() => navigation.navigate('Sync')}
          onSetting={() => navigation.navigate('Profile')}
        />
        <HomeContent />
        {/* <HomeTabNavigator /> */}
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    position: 'relative',
  },
});
