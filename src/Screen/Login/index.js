import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { Logo, Email, Password } from '../../assets';
import { Fonts } from '../../Utils/Fonts';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import * as fs from 'expo-file-system';
import axios from 'axios';
import { Endpoint } from '../../Utils/Endpoint';
import MenuModal from '../../Component/MenuModal';
import LoadingModal from '../../Component/LoadingModal';
import TaskServices from '../../Database/TaskServices';
import { getUniqueId } from 'react-native-device-info';
import NoConnectionModal from '../../Component/NoConnectionModal';
import PopModal from '../../Component/PopModal';
import WarningModal from '../../Component/WarningModal';

const ServerList = [
  {
    // Production
    name: 'Production',
    url: 'http://192.168.100.40:3000/auth/login',
    baseUrl: 'http://apis-dev1.tap-agri.com',
  },
  {
    // QA
    name: 'QA',
    url: 'http://192.168.100.40:3000/auth/login',
    baseUrl: 'http://apis-dev1.tap-agri.com',
  },
  {
    // DEV
    name: 'Development',
    url: 'http://apis-dev1.tap-agri.com/crm-msa-auth-data/',
    baseUrl: 'http://apis-dev1.tap-agri.com',
  },
];

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidden, setHidden] = useState(true);
  const [serverModal, setServerModal] = useState(false);
  const [server, setServer] = useState(0);
  const [deviceId, setDeviceId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connection, setConnection] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [failedModal, setFailedModal] = useState(false);
  const [message, setMessage] = useState('');
  const user = TaskServices.getCurrentUser();

  const postRealm = async (data, token) => {
    console.log(data);
    const body = {
      ID: data.id,
      USER_NAME: data.username,
      ACCESS_TOKEN: token,
      NAME: data.name,
      JOB_DESC: data.jobDesc,
      ROLE_NAME: data.roleId,
      REFERENCE_LOCATION: data.referenceLocation,
      LOCATION: data.location,
      INSERT_TIME: data.insertTime,
      INSERT_USER: data.name,
      UPDATE_TIME: data.updateTime,
      UPDATE_USER: data.name,
      COMP_CODE: data.compCode,
      COMP_NAME: data?.company?.compName || 'Null',
      DELETE_TIME: null,
      DELETE_USER: null,
      LAST_SYNC: null,
      SERVER: ServerList[server].baseUrl
    };

    await TaskServices.saveData('TM_USERS', body);
  };

  const getUserData = async token => {
    try {
      const url = ServerList[server].url + 'auth/me';
      const res = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      if (res) {
        await postRealm(res.data.user, token);
        setIsLoading(false);
        navigation.replace('Home');
      }
    } catch (error) {
      console.log(error, 'error get Data');
      setIsLoading(false);
    }
  };

  const login = async () => {
    if (email === '' && user === undefined) {
      setEmailModal(true)
      return;
    }
    if (password === '') {
      setPasswordModal(true);
      return;
    }
    const isConnected = await NetInfo.fetch();
    if (isConnected.isConnected) {
      setIsLoading(true);
      try {
        const body = {
          username: user === undefined ? email : user.USER_NAME,
          password: password,
          deviceId: deviceId,
        };
        const url = ServerList[server].url + 'auth/login';
        console.log(url, body);
        const res = await axios.post(url, body);
        if (res) {
          console.log(res.data);
          await getUserData(res.data.token);
        }
      } catch (error) {
        if (error.response) {
          setMessage(error.response.data.message || 'Server Error')
          setIsLoading(false);
          setFailedModal(true)
          console.log(error, 'error login');
        } else {
          setMessage('Error Server');
          setIsLoading(false);
          setFailedModal(true)
          console.log(error, 'error login');
        }
      }
    } else {
      setConnection(true);
      setIsLoading(false);
      console.log('not Connected');
    }
  };

  const getID = () => {
    const id = getUniqueId();
    setDeviceId(id);
  };

  useEffect(() => {
    getID();
  }, []);

  const onSelectServer = val => {
    setServer(val);
    setServerModal(false);
  };

  const showModal = () => {
    if (serverModal) {
      return (
        <MenuModal onClose={() => setServerModal(false)} visible={serverModal}>
          {ServerList.map((item, index) => (
            <TouchableOpacity
              onPress={() => onSelectServer(index)}
              key={index}
              activeOpacity={0.8}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonTitle}>{item.name}</Text>
              <Icon name={'adjust'} size={25} color={index === server ? '#195FBA' : '#C5C5C5'} />
            </TouchableOpacity>
          ))}
        </MenuModal>
      );
    }
    if (isLoading) {
      return <LoadingModal />;
    }
    if (connection) {
      return (
        <NoConnectionModal
          visible={connection}
          onClose={() => setConnection(false)}
        />
      );
    }
    if (emailModal) {
      return (
        <PopModal
          visible={emailModal}
          onPress={() => setEmailModal(false)}
          title={'Email Kosong!'}
          content={'Email Tidak Boleh Kosong'}
          image={Email}
        />
      )
    }
    if (passwordModal) {
      return (
        <PopModal
          visible={passwordModal}
          onPress={() => setPasswordModal(false)}
          title={'Password Kosong!'}
          content={'Password Tidak Boleh Kosong'}
          image={Password}
        />
      )
    }
    if (failedModal) {
      return (
        <WarningModal
          visible={failedModal}
          content={message}
          onPress={() => setFailedModal(false)}
        />
      )
    }
  };

  return (
    <>
      {showModal()}
      <StatusBar backgroundColor={'#195FBA'} />
      <View style={styles.container}>
        <KeyboardAvoidingView>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
          >
            <View style={styles.logo}>
              <Image source={Logo} style={styles.image} />
            </View>
            <Text style={styles.title}>Login Screen</Text>
            <Text style={styles.subTitle}>Silakan Login untuk melanjutkan</Text>
            <View style={styles.formContainer}>
              <View style={styles.formInput}>
                <Icon name={'person'} size={20} color={'#DADADA'} />
                {user === undefined ? <TextInput
                  placeholder={'Email'}
                  style={styles.textInput}
                  value={email}
                  onChangeText={val => setEmail(val)}
                /> :
                  <Text style={[styles.textInput, { paddingVertical: 4 }]}>{user.USER_NAME}</Text>
                }
              </View>
              <View style={styles.formInput}>
                <Icon name={'lock'} size={20} color={'#DADADA'} />
                <TextInput
                  placeholder={'Kata Sandi'}
                  secureTextEntry={hidden}
                  style={styles.textInput}
                  value={password}
                  onChangeText={val => setPassword(val)}
                />
                <Icon
                  name={hidden ? 'visibility' : 'visibility-off'}
                  size={20}
                  style={{ paddingLeft: 10 }}
                  color={'#DADADA'}
                  onPress={() => setHidden(!hidden)}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={login}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonTitle}>Masuk</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setServerModal(true)}
              activeOpacity={0.8}
              style={styles.server}
            >
              <Text style={styles.modalButtonTitle}>
                {ServerList[server].name}
              </Text>
              <Icon
                name={serverModal ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={25}
                color={'#195FBA'}
              />
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  logo: {
    width: '70%',
    height: undefined,
    aspectRatio: 3 / 4,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 5,
    marginVertical: 20,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    fontFamily: Fonts.book,
    color: '#797676',
    textAlign: 'center',
    marginBottom: 30,
  },
  formInput: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  textInput: {
    marginLeft: 14,
    flex: 1,
  },
  scroll: {
    paddingBottom: 30,
  },
  button: {
    backgroundColor: '#195FBA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
  },
  buttonTitle: {
    fontSize: 18,
    fontFamily: Fonts.book,
    color: '#FFF',
  },
  formContainer: {
    marginBottom: 30,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D7EAFE',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtonTitle: {
    fontSize: 16,
    fontFamily: Fonts.book,
    color: '#000',
  },
  server: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#195FBA',
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
  },
});
