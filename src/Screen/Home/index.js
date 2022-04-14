import React, { useEffect, useState } from 'react';
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
  Image,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import * as faceapi from 'face-api.js';
import '@tensorflow/tfjs-react-native';
import '../../../platform';
import * as fs from 'expo-file-system';
import axios from 'axios';
import { Endpoint } from '../../Utils/Endpoint';
import { RecognitionOffline } from '../../Utils/RecognitionOffline';
import { Camera, requestCameraPermissionsAsync } from 'expo-camera';
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
import { checkTimezoneSetting, requestAdvanceStoragePermission } from '../../Utils/StoragePermisssion';

moment.locale('id');
const HomeScreen = ({ route }) => {
  const [sync, setSync] = useState(false);
  const [status, setStatus] = useState({
    loading: true,
    message: '',
  });
  const isFocused = useIsFocused()

  const getPermission = async () => {
    await requestAdvanceStoragePermission()
  };

  useEffect(() => {
    getPermission();
  }, [isFocused]);

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
