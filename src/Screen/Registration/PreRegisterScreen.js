import React, { useState, useMemo } from 'react';
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
import BottomModal from '../../Component/BottomModal';

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

const ReferenceLocation = [
  {
    value: 'Afdeling',
    name: 'Afdeling',
  },
  {
    value: 'Estate',
    name: 'Estate',
  }, {
    value: 'Company',
    name: 'Company',
  },
]

const PreRegisterScreen = () => {
  const MasterEstate = TaskServices.getAllData('TM_EST');
  const MasterCompany = TaskServices.getAllData('TM_COMP');
  const MasterAfdeling = TaskServices.getAllData('TM_AFD');
  const MasterEmployee = TaskServices.getAllData('TM_EMPLOYEE');
  const navigation = useNavigation();
  const user = TaskServices.getCurrentUser();
  const [type, setType] = useState(1);
  const [typeModal, setTypeModal] = useState(false);
  const [nik, setNik] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState();
  const [locationModal, setLocationModal] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [data, setData] = useState();
  const [employeeModal, setEmployeeModal] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [referenceLocation, setReferenceLocation] = useState('Afdeling');
  const [referenceModal, setReferenceModal] = useState(false);

  const onRegister = async () => {
    const id = UuidGenerator();
    const locationCode = () => {
      if (referenceLocation == 'Afdeling') {
        return location.AFD_CODE_GIS
      } else if (referenceLocation == 'Estate') {
        return location.EST_CODE
      } else {
        return location.COMP_CODE
      }
    }
    const body = {
      ID: type === 1 ? data?.ID : id,
      TYPE: type === 1 ? 'E' : 'N',
      SOURCE: type === 1 ? data?.SOURCE : 'MANUAL',
      EMPLOYEE_NIK: type === 1 ? data?.EMPLOYEE_NIK.split(' ').join('') : nik,
      EMPLOYEE_FULLNAME: type === 1 ? data?.EMPLOYEE_FULLNAME : name.toUpperCase(),
      EMPLOYEE_POSITION: type === 1 ? data?.EMPLOYEE_POSITION : null,
      EMPLOYEE_JOINDATE: type === 1 ? data?.EMPLOYEE_JOINDATE : new Date(),
      EMPLOYEE_RESIGNDATE: type === 1 ? data?.EMPLOYEE_RESIGNDATE : null,
      REFERENCE_LOCATION: type === 1 ? data?.REFERENCE_LOCATION : referenceLocation,
      AFD_CODE: type === 1 ? data?.AFD_CODE : locationCode(),
      COMP_CODE: type === 1 ? data?.COMP_CODE : locationCode(),
      WERKS: type === 1 ? data?.WERKS : locationCode(),
      REGISTER_STATUS: 'PROCESS',
      FACE_DESCRIPTOR: type === 1 ? data?.FACE_DESCRIPTOR : null,
      INSERT_TIME: new Date(),
      INSERT_USER: type === 1 ? data?.INSERT_USER : user.NAME,
      REGISTER_TIME: new Date(),
      REGISTER_USER: name,
      UPDATE_TIME: new Date(),
      UPDATE_USER: user.NAME,
      DELETE_TIME: null,
      DELETE_USER: null,
      SYNC_STATUS: null,
      SYNC_TIME: null,
    };

    navigation.navigate('Registration Home', { data: body });
  };

  const onPickType = val => {
    setType(val);
    setTypeModal(false);
  };

  const onPickLocation = val => {
    setLocation(val);
    setLocationModal(false);
    setEmployeeSearch('')
  };

  const onPickReference = val => {
    setReferenceLocation(val);
    setReferenceModal(false);
  }

  const renderAfdeling = ({ item, index }) => {
    const code = () => {
      if (referenceLocation == 'Afdeling') {
        return item.AFD_CODE_GIS
      } else if (referenceLocation == 'Estate') {
        return item.EST_CODE
      } else {
        return item.COMP_CODE
      }
    }

    const name = () => {
      if (referenceLocation == 'Afdeling') {
        return item.AFD_NAME
      } else if (referenceLocation == 'Estate') {
        return item.EST_NAME
      } else {
        return item.COMP_NAME
      }
    }
    return (
      <TouchableOpacity
        onPress={() => onPickLocation(item)}
        key={index}
        activeOpacity={0.8}
        style={styles.modalButton}
      >
        <Text style={styles.modalButtonTitle}>{code()} - {name()}</Text>
        <Icon name={'adjust'} size={25} color={'#195FBA'} />
      </TouchableOpacity>
    )
  }

  const onPickEmployee = val => {
    setData(val)
    setEmployeeModal(false)
    setEmployeeSearch('')
  }

  const renderEmployee = ({ item, index }) => {
    const nik = item.EMPLOYEE_NIK.split(' ').join('');
    return (
      <TouchableOpacity
        onPress={() => onPickEmployee(item)}
        key={index}
        activeOpacity={0.8}
        style={styles.modalButton}
      >
        <Text style={styles.modalButtonTitle}>{nik} - {item.EMPLOYEE_FULLNAME}</Text>
      </TouchableOpacity>
    )
  }

  const ListAfdeling = useMemo(() => {
    const res = MasterAfdeling.map((item) => item).sort((a, b) => parseInt(a.COMP_CODE, 10) - parseInt(b.COMP_CODE, 10))
    if (locationSearch !== '') {
      return res.filter((item) =>
        item.AFD_CODE_GIS.toLowerCase().includes(locationSearch.toLocaleLowerCase()) ||
        item.COMP_CODE.includes(locationSearch) ||
        item.EST_CODE.includes(locationSearch)
      )
    } else {
      return res
    }
  }, [MasterAfdeling, locationSearch])

  const ListEstate = useMemo(() => {
    const res = MasterEstate.map((item) => item).sort((a, b) => parseInt(a.COMP_CODE, 10) - parseInt(b.COMP_CODE, 10))
    if (locationSearch !== '') {
      return res.filter((item) =>
        item.EST_NAME.toLowerCase().includes(locationSearch.toLocaleLowerCase()) ||
        item.COMP_CODE.includes(locationSearch) ||
        item.EST_CODE.includes(locationSearch) ||
        item.WERKS.includes(locationSearch)
      )
    } else {
      return res
    }
  }, [MasterEstate, locationSearch])

  const ListCompany = useMemo(() => {
    const res = MasterCompany.map((item) => item).sort((a, b) => parseInt(a.COMP_CODE, 10) - parseInt(b.COMP_CODE, 10))
    if (locationSearch !== '') {
      return res.filter((item) =>
        item.COMP_NAME.toLowerCase().includes(locationSearch.toLocaleLowerCase()) ||
        item.COMP_CODE.includes(locationSearch) ||
        item.REGION_CODE.includes(locationSearch)
      )
    } else {
      return res
    }
  }, [MasterCompany, locationSearch])

  const List = () => {
    if (referenceLocation == 'Afdeling') {
      return ListAfdeling
    } else if (referenceLocation == 'Estate') {
      return ListEstate
    } else {
      return ListCompany
    }
  }

  const ListEmployee = useMemo(() => {
    const res = MasterEmployee.filter((item) => item.TYPE === 'E');

    if (employeeSearch !== '') {
      return res.filter((item) =>
        item.EMPLOYEE_NIK.split(' ').join('').includes(employeeSearch) ||
        item.EMPLOYEE_FULLNAME.toLowerCase().includes(employeeSearch.toLowerCase()))
    } else {
      return res;
    }
  }, [MasterEmployee, employeeSearch])

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
    if (referenceModal) {
      return (
        <MenuModal onClose={() => setReferenceModal(false)} visible={referenceModal}>
          {ReferenceLocation.map((item, index) => (
            <TouchableOpacity
              onPress={() => onPickReference(item.value)}
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
        <BottomModal
          visible={locationModal}
          onClose={() => {
            setLocationModal(false)
            setLocationSearch('')
          }}
          title={'Pilih Lokasi'}
          search={true}
          searchPlaceholder={'Cari Lokasi'}
          searchValue={locationSearch}
          onSearch={(val) => setLocationSearch(val)}
          titleBottomButton={'Tutup'}
          size={0.6}
          bottomOnPress={() => {
            setLocationModal(false)
            setLocationSearch('')
          }}>
          <FlatList
            data={List()}
            keyExtractor={(_, i) => i.toString()}
            renderItem={renderAfdeling}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false} />
        </BottomModal>
      );
    }
    if (employeeModal) {
      return (
        <BottomModal
          visible={employeeModal}
          onClose={() => {
            setEmployeeModal(false)
            setEmployeeSearch('')
          }}
          title={'Pilih Karyawan'}
          search={true}
          searchPlaceholder={'Cari Nama/Nik Karyawan'}
          searchValue={employeeSearch}
          onSearch={(val) => setEmployeeSearch(val)}
          titleBottomButton={'Tutup'}
          size={0.6}
          bottomOnPress={() => {
            setEmployeeModal(false)
            setEmployeeSearch('')
          }}>
          <FlatList
            data={ListEmployee}
            keyExtractor={(_, i) => i.toString()}
            renderItem={renderEmployee}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false} />
        </BottomModal>
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

  const locations = () => {
    if (referenceLocation == 'Afdeling') {
      return location.AFD_CODE_GIS
    } else if (referenceLocation == 'Estate') {
      return location.EST_NAME
    } else {
      return location.COMP_NAME
    }
  }

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
            {/* <Text style={styles.subTitle}>Silakan Login untuk melanjutkan</Text> */}
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
              <Text style={styles.formTitle}>{type === 1 ? 'NIK' : 'No. Identitas'}</Text>
              {type === 1 ? (
                <TouchableOpacity
                  style={[
                    styles.accountBar,
                    { borderWidth: 1, borderColor: '#C5C5C5' },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setEmployeeModal(true)}
                >
                  <View style={styles.left}>
                    <Text style={styles.formTxt}>
                      {data === undefined ? 'Pilih Karyawan' : data?.EMPLOYEE_NIK.split(' ').join('')}
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
                    placeholder={'No. Identitas'}
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
                      {data === undefined ? 'Nama Karyawan' : data?.EMPLOYEE_FULLNAME}
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
              <Text style={styles.accountTitle}>Referensi Lokasi</Text>
              <TouchableOpacity
                style={[
                  styles.accountBar,
                  { borderWidth: 1, borderColor: '#C5C5C5' },
                ]}
                activeOpacity={0.8}
                disabled={type === 1}
                onPress={() => setReferenceModal(true)}
              >
                {type === 1 ?
                  <View style={styles.left}>
                    <Icon name={'location-pin'} size={25} color={'#DADADA'} />
                    <Text style={styles.formTxt}>{data === undefined ? 'Pilih Referensi Lokasi' : data?.REFERENCE_LOCATION}</Text>
                  </View>
                  :
                  <View style={styles.left}>
                    <Icon name={'location-pin'} size={25} color={'#DADADA'} />
                    <Text style={styles.formTxt}>{referenceLocation}</Text>
                  </View>
                }
                {type === 2 && <View style={styles.right}>
                  <Icon name={'arrow-drop-down'} size={25} color={'#797676'} />
                </View>}
              </TouchableOpacity>
            </View>
            <View style={styles.form}>
              <Text style={styles.accountTitle}>Lokasi</Text>
              <TouchableOpacity
                style={[
                  styles.accountBar,
                  { borderWidth: 1, borderColor: '#C5C5C5' },
                ]}
                activeOpacity={0.8}
                disabled={type === 1}
                onPress={() => setLocationModal(true)}
              >
                {type === 1 ?
                  <View style={styles.left}>
                    <Icon name={'location-pin'} size={25} color={'#DADADA'} />
                    <Text style={styles.formTxt}>{data === undefined ? 'Pilih Lokasi' : data?.WERKS}</Text>
                  </View>
                  :
                  <View style={styles.left}>
                    <Icon name={'location-pin'} size={25} color={'#DADADA'} />
                    <Text style={styles.formTxt}>{location === undefined ? 'Pilih Lokasi' : locations()}</Text>
                  </View>
                }
                {type === 2 && <View style={styles.right}>
                  <Icon name={'arrow-drop-down'} size={25} color={'#797676'} />
                </View>}
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
    marginBottom: 20,
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
    marginHorizontal: 20,
  },
  modalButtonTitle: {
    fontSize: 16,
    fontFamily: Fonts.book,
    color: '#000',
  },
  list: {
    paddingTop: 15,
    paddingBottom: 10
  }
});
