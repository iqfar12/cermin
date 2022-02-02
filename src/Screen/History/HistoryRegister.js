import React, {useState, useMemo} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import SubHeader from '../../Component/SubHeader';
import {useNavigation} from '@react-navigation/native';
import {Fonts} from '../../Utils/Fonts';
import moment from 'moment';
import Icon from '@expo/vector-icons/MaterialIcons';
import TaskServices from '../../Database/TaskServices';

const Dummy = [
  {
    name: 'John Doe',
    nik: '3013021988280001',
    status: true,
  },
  {
    name: 'John Doe',
    nik: '3013021988280001',
    status: true,
  },
  {
    name: 'John Doe',
    nik: '3013021988280001',
    status: true,
  },
  {
    name: 'John Doe',
    nik: '3013021988280001',
    status: true,
  },
  {
    name: 'John Doe',
    nik: '3013021988280001',
    status: false,
  },
  {
    name: 'John Doe',
    nik: '3013021988280001',
    status: false,
  },
  {
    name: 'John Doe',
    nik: '3013021988280001',
    status: false,
  },
  {
    name: 'John Doe',
    nik: '3013021988280001',
    status: false,
  },
  {
    name: 'John Doe',
    nik: '3013021988280001',
    status: false,
  },
];

const HistoryRegister = () => {
  const navigation = useNavigation();
  const [menu, setMenu] = useState(0);
  const Employee = TaskServices.getAllData('TM_EMPLOYEE').filter((item) => item.REGISTER_STATUS !== 'NONE');

  const Karyawan = useMemo(() => {
    return Employee.filter((item) => item.TYPE == 'E')
  }, [Employee])

  const NonKaryawan = useMemo(() => {
    return Employee.filter((item) => item.TYPE == 'N');
  }, [Employee])

  console.log(NonKaryawan);

  const renderListCard = ({item, index}) => {
    return (
      <View style={styles.card}>
        <View style={styles.topCard}>
          <View style={styles.tag}>
            <Text style={styles.type}>{item.TYPE == 'E' ? 'Karyawan' : 'Non-Karyawan'}</Text>
          </View>
          <Icon
            name={item.SYNC_TIME !== null ? 'done' : 'radio-button-unchecked'}
            size={25}
            color={item.SYNC_TIME !== null ? '#195FBA' : '#FFB81C'}
          />
        </View>
        <View style={styles.bottomCard}>
          <Text style={styles.nik}>{item.EMPLOYEE_NIK?.split('')?.filter(item => item != ' ')?.join('')}</Text>
          <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.name}> | {item.EMPLOYEE_FULLNAME}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <SubHeader title={'Batalkan'} onBack={() => navigation.goBack()} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riwayat Pendaftaran</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.topTab}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setMenu(0)}
            style={menu === 0 ? styles.selectedTab : styles.tab}
          >
            <Text
              style={menu === 0 ? styles.selectedTabTitle : styles.tabTitle}
            >
              Karyawan ({Karyawan.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setMenu(1)}
            style={menu === 1 ? styles.selectedTab : styles.tab}
          >
            <Text
              style={menu === 1 ? styles.selectedTabTitle : styles.tabTitle}
            >
              Non-Karyawan ({NonKaryawan.length})
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <Text style={styles.date}>
            {moment(new Date()).format('DD MMMM YYYY')}
          </Text>
          <FlatList
            data={menu === 0 ? Karyawan : NonKaryawan}
            renderItem={renderListCard}
            keyExtractor={(_, i) => i.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.empty}>Empty</Text>}
          />
        </View>
      </View>
    </>
  );
};

export default HistoryRegister;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  header: {
    backgroundColor: '#195FBA',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#FFF',
  },
  topTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#005BB3',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#FFF',
  },
  selectedTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F2F2',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 12,
  },
  selectedTabTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#6C6C6C',
  },
  date: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#6C6C6C',
    paddingVertical: 14,
  },
  body: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    elevation: 0.5,
    padding: 12,
    marginBottom: 12,
  },
  topCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#D7E6F9',
    borderWidth: 1,
    borderColor: '#6DA9F6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  bottomCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nik: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#6C6C6C',
  },
  name: {
    fontSize: 16,
    fontFamily: Fonts.book,
    color: '#6C6C6C',
    width: '55%'
  },
  list: {
    paddingBottom: 100,
  },
  empty: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#000',
    textAlign: 'center',
    paddingVertical: 10,
  }
});
