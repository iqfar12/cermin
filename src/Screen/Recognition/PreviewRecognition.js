import React, { useMemo, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialIcons';
import SubmitButton from '../../Component/SubmitButton';
import { Fonts } from '../../Utils/Fonts';
import TaskServices from '../../Database/TaskServices';
import { UuidGenerator } from '../../Utils/UuidGenerator';

const PreviewRecognition = ({ route }) => {
  const navigation = useNavigation();
  const { data, image } = route.params;
  const [count, setCount] = useState(10);
  const MasterEmployee = TaskServices.getAllData('TM_EMPLOYEE');
  const MasterAbsenceCode = TaskServices.getAllData('TM_ABSENCE_TYPE');
  const Results = useMemo(() => {
    const res = MasterEmployee.find((item) => item.EMPLOYEE_NIK == data?.label);
    return res
  }, [data, MasterEmployee])

  const onAttendance = async () => {
    if (Results === undefined) {
      navigation.navigate('Home')
    } else {
      const id = UuidGenerator();
      const code = MasterAbsenceCode.find((item) => item.TYPE == 'WORKED' && item.SOURCE == Results.SOURCE)?.CODE
      // 1 = Masuk
      // 2 = Istirahat
      // 3 = Pulang
      // 4 = Izin
      const body = {
        ID: id,
        EMPLOYEE_ID: Results.ID,
        TYPE: '1',
        ABSENCE_CODE: code || 'K',
        DATETIME: new Date(),
        ACCURACY: data?.accuracy,
        LATITUDE: data?.coord?.latitude || 0.00,
        LONGITUDE: data?.coord?.longitude || 0.00,
        MANUAL_INPUT: 0,
        DESCRIPTION: 'Absen Masuk',
        INSERT_TIME: new Date(),
        INSERT_USER: Results.EMPLOYEE_NIK,
        SYNC_STATUS: null,
        SYNC_TIME: null,
      }

      await TaskServices.saveData('TR_ATTENDANCE', body);

      navigation.replace('Take Picture Recognition');
    }
  }

  useEffect(() => {
    if (Results !== undefined) {
      if (count > 0) {
        setTimeout(() => {
          setCount(count - 1)
        }, 1000)
      } else {
        onAttendance();
      }
    }
  }, [count])

  return (
    <>
      <StatusBar translucent backgroundColor={'rgba(0, 0, 0, 0)'} />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          <View style={styles.previewImage}>
            <View style={styles.bigImage}>
              <Image
                style={styles.image}
                source={image}
              />
            </View>
          </View>
          <View style={styles.bottom}>
            {Results !== undefined ? <View style={styles.infoContainer}>
              <Text style={styles.name}>{Results.EMPLOYEE_FULLNAME}</Text>
              <View style={styles.midText}>
                <Text style={styles.nik}>{Results.EMPLOYEE_NIK}</Text>
                <Icon name={'location-pin'} size={20} color={'#C5C5C5'} />
                <Text style={styles.afd}>{Results.WERKS}</Text>
              </View>
              <View style={styles.type}>
                <Text style={styles.typeTxt}>
                  {Results.TYPE == 'E' ? 'Employee' : 'Non-Employee'}
                </Text>
              </View>
            </View> :
              <View style={styles.infoContainer}>
                <Text style={styles.name}>Wajah Tidak Ditemukan</Text>
              </View>}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.replace('Take Picture Recognition', { data: data })}
                style={styles.retake}
              >
                <Text style={styles.retakeTxt}>Ambil Ulang</Text>
                <Icon name={'party-mode'} size={30} color={'#195FBA'} />
              </TouchableOpacity>
              {Results !== undefined && <SubmitButton onPress={onAttendance} title={`Absen${Results !== undefined ? `(${count})` : ''} `} />}
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default PreviewRecognition;

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
    alignItems: 'center',
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
    borderWidth: 1,
    borderColor: '#C5C5C5'
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
