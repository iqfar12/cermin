import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {CenterDone} from '../../assets';
import axios from 'axios';
import {Endpoint} from '../../Utils/Endpoint';
import {manipulateAsync} from 'expo-image-manipulator';
import {Fonts} from '../../Utils/Fonts';
import SubmitButton from '../../Component/SubmitButton';
import {getImagePath} from '../../Utils/PathHelper';
import fs from 'react-native-fs';
import {UuidGenerator} from '../../Utils/UuidGenerator';
import TaskServices from '../../Database/TaskServices';
import * as expoFS from 'expo-file-system';
import SoundPlayer from 'react-native-sound-player';
import { dateGenerator } from '../../Utils/DateConverter';


const PreviewScreen = ({route}) => {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();
  const user = TaskServices.getCurrentUser();
  console.log(route.params, 'params');
  const {preview, data} = route.params;

  useEffect(() => {
    setTimeout(() => {
      SoundPlayer.playSoundFile('success_regis', 'mp3')
    }, 1000)
  }, []);

  const register = async () => {
    let formData = new FormData();
    // await Promise.all([
    preview?.forEach(async (item, index) => {
      // const resize = {width: item.width / 5, height: item.height / 5};
      // const results = await manipulateAsync(item.uri, [{resize}], {
      //   base64: true,
      // });
      formData.append('images', {
        uri: item.uri,
        type: 'image/jpeg',
        name: `image_${index}.jpg`,
      });
    });
    // ]);
    formData.append('label', route.params.label);
    console.log(formData);
    try {
      const res = await axios.post(Endpoint.Register, formData, {
        headers: {
          Accept: 'multipart/form-data',
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res) {
        console.log(res.data);
        navigation.navigate('Finish Screen', {
          status: res.status,
          message: 'Daftar Berhasil',
        });
      }
    } catch (error) {
      navigation.navigate('Finish Screen', {
        status: error.response.status,
        message: error.response.message || 'Gagal',
      });
      console.log(error.response, 'error');
    }
  };

  const onRegister = async () => {
    const imagePath = getImagePath();
    const namePath = imagePath + `/${data?.EMPLOYEE_FULLNAME}`;
    await fs.mkdir(namePath);
    preview.forEach(async (item, index) => {
      const path = namePath + `/${data?.EMPLOYEE_FULLNAME}_${index}.jpeg`;
      await fs.copyFile(item.uri, path);
      const id = UuidGenerator();
      const body = {
        ID: id,
        MODEL: data?.ID,
        MODEL_ID: data?.ID,
        NAME: data?.EMPLOYEE_FULLNAME,
        FILE_NAME: data?.EMPLOYEE_FULLNAME,
        URL: path,
        INSERT_TIME: dateGenerator(),
        INSERT_USER: user.NAME,
        SYNC_STATUS: null,
        SYNC_TIME: null,
      };

      await TaskServices.saveData('TR_IMAGES', body)
    });
    await TaskServices.saveData('TM_EMPLOYEE', data);
    navigation.reset({
      index: 0,
      routes: [{name: 'PreRegister'}],
    });
  };

  return (
    <>
      <StatusBar translucent backgroundColor={'rgba(0, 0, 0, 0)'} />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          <View style={styles.previewImage}>
            <View style={styles.bigImage}>
              <Image
                style={styles.image}
                source={{uri: route?.params?.preview[index]?.uri}}
              />
            </View>
            <View style={styles.listContainer}>
              {route?.params?.preview.map((item, idx) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIndex(idx)}
                  key={idx}
                  style={[styles.listImage, index === idx && styles.selected]}
                >
                  <Image
                    style={[
                      styles.image,
                      index === idx
                        ? styles.selectedImage
                        : styles.nonSelectedImage,
                    ]}
                    source={{uri: item.uri}}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.bottom}>
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{data?.EMPLOYEE_FULLNAME}</Text>
              <View style={styles.midText}>
                <Text style={styles.nik}>{data?.EMPLOYEE_NIK}</Text>
                <Icon name={'location-pin'} size={20} color={'#C5C5C5'} />
                <Text style={styles.afd}>{data?.AFD_CODE}</Text>
              </View>
              <View style={styles.type}>
                <Text style={styles.typeTxt}>
                  {data?.TYPE == 'E' ? 'Employee' : 'Non-Employee'}
                </Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.replace('Registration Home', {data: data})}
                style={styles.retake}
              >
                <Text style={styles.retakeTxt}>Ambil Ulang</Text>
                <Icon name={'party-mode'} size={30} color={'#195FBA'} />
              </TouchableOpacity>
              <SubmitButton onPress={onRegister} title={'Daftarkan'} />
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default PreviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  bigImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 3 / 4,
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  listContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: 10,
    paddingBottom: 20,
    bottom: 0,
    width: '100%',
    paddingHorizontal: 20,
  },
  listImage: {
    width: '15%',
    height: undefined,
    aspectRatio: 3 / 4,
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 3,
    overflow: 'hidden',
  },
  previewImage: {
    position: 'relative',
  },
  selected: {
    borderWidth: 3,
    borderColor: '#6DA9F7',
  },
  selectedImage: {
    opacity: 1,
  },
  nonSelectedImage: {
    opacity: 0.7,
  },
  bottom: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: -15,
    zIndex: 100,
    paddingVertical: 25,
  },
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    borderBottomWidth: 1,
    borderColor: '#C5C5C5',
    paddingBottom: 30,
    marginBottom: 25,
  },
  name: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#383636',
    textAlign: 'center',
    marginBottom: 5,
  },
  midText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  nik: {
    fontSize: 18,
    fontFamily: Fonts.book,
    color: '#383636',
    paddingRight: 10,
    borderRightWidth: 1,
    borderColor: '#C5C5C5',
    marginRight: 15,
  },
  afd: {
    fontSize: 18,
    fontFamily: Fonts.book,
    color: '#383636',
  },
  type: {
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6DA9F6',
    backgroundColor: '#D7E6F9',
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  typeTxt: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#195FBA',
  },
  retake: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 30,
    paddingVertical: 15,
    marginBottom: 10,
  },
  retakeTxt: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000',
    marginRight: 10,
  },
});
