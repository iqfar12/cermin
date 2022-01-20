import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import SubHeader from '../../Component/SubHeader';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../Utils/Fonts';
import Icon from '@expo/vector-icons/MaterialIcons';
import SubmitButton from '../../Component/SubmitButton';
import MenuModal from '../../Component/MenuModal';
import TaskServices from '../../Database/TaskServices';
import { v4 as uuidV4 } from 'uuid';
import { UuidGenerator } from '../../Utils/UuidGenerator';
import DummyAFD from '../../assets/DummyAFD.json';

const RightComponent = ({ navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('History Register')}
      activeOpacity={0.8}
      style={styles.right}
    >
      <Text style={styles.rightTxt}>Riwayat</Text>
      <Icon name={'history'} size={25} color={'#FFF'} />
    </TouchableOpacity>
  );
};

const TypeEmployee = [
  {
    value: 1,
    name: 'Employee',
  },
  {
    value: 2,
    name: 'Non-Employee',
  },
];

const PreRegisterScreen = () => {
  const MasterAfdeling = TaskServices.getAllData('TM_AFD');
  const navigation = useNavigation();
  const user = TaskServices.getCurrentUser();
  const [type, setType] = useState(1);
  const [typeModal, setTypeModal] = useState(false);
  const [nik, setNik] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState();
  const [locationModal, setLocationModal] = useState(false);
  const [data, setData] = useState();
  console.log(DummyAFD.TM_AFD);

  const onRegister = async () => {
    const id = UuidGenerator();
    const data = {
      ID: id,
      TYPE: type,
      SOURCE: 'Manual',
      EMPLOYEE_NIK: nik,
      EMPLOYEE_FULLNAME: name,
      EMPLOYEE_POSITION: null,
      EMPLOYEE_JOINDATE: new Date(),
      EMPLOYEE_RESIGNDATE: null,
      AFD_CODE: location.AFD_CODE_GIS,
      FACE_DESCRIPTOR: null,
      INSERT_TIME: new Date(),
      INSERT_USER: user.NAME,
      REGISTER_TIME: new Date(),
      REGISTER_USER: name,
      UPDATE_TIME: new Date(),
      UPDATE_USER: user.NAME,
      DELETE_TIME: null,
      DELETE_USER: null,
      SYNC_STATUS: null,
      SYNC_TIME: null,
    };

    await TaskServices.saveData('TM_EMPLOYEE', data);
    navigation.navigate('Registration Home', { data });
  };

  const onPickType = val => {
    setType(val);
    setTypeModal(false);
  };

  const onPickLocation = val => {
    setLocation(val);
    setLocationModal(false);
  };

  const renderAfdeling = ({ item, index }) => {    
    return (
      <TouchableOpacity
        onPress={() => onPickLocation(item)}
        key={index}
        activeOpacity={0.8}
        style={styles.modalButton}
      >
        <Text style={styles.modalButtonTitle}>{item.AFD_CODE_GIS}</Text>
        <Icon name={'adjust'} size={25} color={'#195FBA'} />
      </TouchableOpacity>
    )
  }

  const showModal = () => {
    if (typeModal) {
      return (
        <MenuModal onClose={() => setTypeModal(false)} visible={typeModal}>
          {TypeEmployee.map((item, index) => (
            <TouchableOpacity
              onPress={() => onPickType(item.value)}
              key={index}
              activeOpacity={0.8}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonTitle}>{item.name}</Text>
              <Icon name={'adjust'} size={25} color={'#195FBA'} />
            </TouchableOpacity>
          ))}
        </MenuModal>
      );
    }
    if (locationModal) {
      return (
        <MenuModal
          onClose={() => setLocationModal(false)}
          visible={locationModal}
        >
          <FlatList data={DummyAFD.TM_AFD} keyExtractor={(_, i) => i.toString()} renderItem={renderAfdeling} showsVerticalScrollIndicator={false} />
        </MenuModal>
      );
    }
  };

  const disabled = () => {
    if (type === 1 && data === undefined) {
      return true;
    } else if (
      type === 2 &&
      (nik === '' || name === '' || location === undefined)
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      {showModal()}
      <SubHeader
        right={<RightComponent navigation={navigation} />}
        onBack={() => navigation.goBack()}
        title={'Batalkan'}
      />
      <View style={styles.container}>
        <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Isi keterangan data</Text>
          <Text style={styles.subTitle}>Silakan Login untuk melanjutkan</Text>
        </View>
        <View style={styles.account}>
          <Text style={styles.accountTitle}>Tipe Akun</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setTypeModal(true)}
            style={styles.accountBar}
          >
            <View style={styles.left}>
              <Icon name={'person'} size={25} color={'#DADADA'} />
              <Text style={styles.accountTxt}>
                {TypeEmployee.find(item => item.value === type)?.name}
              </Text>
            </View>
            <View style={styles.right}>
              <Icon name={'arrow-drop-down'} size={25} color={'#797676'} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.form}>
            <Text style={styles.formTitle}>NIK</Text>
            {type === 1 ? (
              <TouchableOpacity
                style={[
                  styles.accountBar,
                  { borderWidth: 1, borderColor: '#C5C5C5' },
                ]}
                activeOpacity={0.8}
              >
                <View style={styles.left}>
                  <Text style={styles.formTxt}>
                    {data === undefined ? 'Pilih Karyawan' : 'Nik'}
                  </Text>
                </View>
                <View style={styles.right}>
                  <Icon name={'arrow-drop-down'} size={25} color={'#797676'} />
                </View>
              </TouchableOpacity>
            ) : (
                <TextInput
                  style={styles.input}
                  value={nik}
                  onChangeText={val => setNik(val)}
                  placeholder={'NIK'}
                />
              )}
          </View>
          <View style={styles.form}>
            <Text style={styles.formTitle}>Nama Lengkap</Text>
            {type === 1 ? (
              <TouchableOpacity
                style={[
                  styles.accountBar,
                  { borderWidth: 1, borderColor: '#C5C5C5' },
                ]}
                disabled
                activeOpacity={1}
              >
                <View style={styles.left}>
                  <Text style={styles.formTxt}>
                    {data === undefined ? 'Nama Karyawan' : 'Nik'}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
                <TextInput
                  style={styles.input}
                  placeholder={'Nama'}
                  value={name}
                  onChangeText={val => setName(val)}
                />
              )}
          </View>
          <View style={styles.form}>
            <Text style={styles.accountTitle}>Lokasi</Text>
            <TouchableOpacity
              style={[
                styles.accountBar,
                { borderWidth: 1, borderColor: '#C5C5C5' },
              ]}
              activeOpacity={0.8}
              onPress={() => setLocationModal(true)}
            >
              <View style={styles.left}>
                <Icon name={'location-pin'} size={25} color={'#DADADA'} />
                <Text style={styles.formTxt}>{location === undefined ? 'Pilih Lokasi' : location.AFD_CODE_GIS}</Text>
              </View>
              <View style={styles.right}>
                <Icon name={'arrow-drop-down'} size={25} color={'#797676'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.button}>
          <SubmitButton
            disabled={disabled()}
            title={'Daftar'}
            onPress={onRegister}
          />
        </View>
        </ScrollView>
      </View>
    </>
  );
};

export default PreRegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  titleContainer: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: '#000',
  },
  subTitle: {
    fontSize: 16,
    fontFamily: Fonts.book,
    color: '#797676',
  },
  account: {
    paddingVertical: 25,
    paddingHorizontal: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#DADADA',
    marginBottom: 25,
  },
  accountTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#797676',
  },
  accountBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 3,
    borderColor: '#195FBA',
    borderRadius: 10,
    marginTop: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountTxt: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#383636',
    marginLeft: 10,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  formTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#797676',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    fontSize: 18,
    fontFamily: Fonts.book,
  },
  form: {
    marginBottom: 25,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    marginRight: 25,
  },
  rightTxt: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#FFF',
    marginRight: 10,
  },
  formTxt: {
    fontSize: 18,
    fontFamily: Fonts.book,
    color: '#383636',
    marginLeft: 15,
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
});
