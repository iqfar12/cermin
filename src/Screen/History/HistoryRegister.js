import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import SubHeader from '../../Component/SubHeader';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../Utils/Fonts';
import moment from 'moment';
import Icon from '@expo/vector-icons/MaterialIcons';
import TaskServices from '../../Database/TaskServices';
import DateTimePicker from '@react-native-community/datetimepicker';
import { dateConverter } from '../../Utils/DateConverter';

const HistoryRegister = () => {
  const navigation = useNavigation();
  const [menu, setMenu] = useState(0);
  const Employee = TaskServices.getAllData('TM_EMPLOYEE').filter((item) => item.REGISTER_STATUS !== 'NONE');
  const user = TaskServices.getCurrentUser();
  const [date, setDate] = useState(new Date());
  const [dateModal, setDateModal] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setDateModal(Platform.OS === 'ios');
    setDate(currentDate);
  }

  const Karyawan = useMemo(() => {
    const res = Employee.filter((item) => item.TYPE == 'E' && item.REGISTER_USER == user.USER_NAME).filter((item) => {
      const updateTime = dateConverter(item.UPDATE_TIME);
      const dateNow = dateConverter(date);
      return updateTime === dateNow
    }).sort((a, b) => b.UPDATE_TIME.getTime() - a.UPDATE_TIME.getTime())
    return res
  }, [Employee, date])

  const NonKaryawan = useMemo(() => {
    const res = Employee.filter((item) => item.TYPE == 'N' && item.REGISTER_USER == user.USER_NAME).filter((item) => {
      const updateTime = dateConverter(item.UPDATE_TIME);
      const dateNow = dateConverter(date);
      return updateTime === dateNow
    }).sort((a, b) => b.UPDATE_TIME.getTime() - a.UPDATE_TIME.getTime())
    return res
  }, [Employee, date])

  const renderListCard = ({ item, index }) => {
    return (
      <View style={styles.card}>
        <View style={styles.topCard}>
          <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.name}>{item.EMPLOYEE_FULLNAME}</Text>
          {/* <View style={styles.tag}>
            <Text style={styles.type}>{item.TYPE == 'E' ? 'Karyawan' : 'Non-Karyawan'}</Text>
          </View> */}
          {item.REGISTER_STATUS == 'REJECTED' ?
            <Icon
              name={'close'}
              size={25}
              color={'#DC1B0F'}
            />
            :
            <Icon
              name={item.SYNC_TIME !== null ? 'done' : 'radio-button-unchecked'}
              size={25}
              color={item.SYNC_TIME !== null ? '#195FBA' : '#FFB81C'}
            />}
        </View>
        <View style={styles.bottomCard}>
          <Text style={styles.nik}>{item.EMPLOYEE_NIK}<Text style={styles.time}> | {moment(item.UPDATE_TIME).format('HH:mm')}</Text></Text>
          <View style={[styles.tag, item.REGISTER_STATUS == 'REJECTED' && { borderColor: '#DC1B0F', backgroundColor: 'rgba(220, 27, 15, 0.3)' }]}>
            <Text style={styles.statusTxt}>{item.REGISTER_STATUS}</Text>
          </View>
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
          <View style={styles.listHeader}>
            <Text style={styles.date}>
              {moment(date).format('DD MMMM YYYY')}
            </Text>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setDateModal(true)} style={styles.selectDate}>
              <Text style={styles.selectDateTxt}>Pilih Tanggal</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={menu === 0 ? Karyawan : NonKaryawan}
            renderItem={renderListCard}
            keyExtractor={(_, i) => i.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.empty}>Empty</Text>}
          />
        </View>
        {dateModal && (
          <DateTimePicker
            value={date}
            mode={'date'}
            display="default"
            onChange={onDateChange}
          />
        )}
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
    marginBottom: 10,
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
    justifyContent: 'space-between',
  },
  nik: {
    fontSize: 16,
    fontFamily: Fonts.book,
    color: '#6C6C6C',
  },
  time: {
    fontFamily: Fonts.book,
    color: '#000'
  },
  name: {
    fontSize: 16,
    fontFamily: Fonts.bold,
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
  },
  statusTxt: {
    fontSize: 12,
    fontFamily: Fonts.book,
    color: '#000',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectDate: {
    paddingLeft: 10,
  },
  selectDateTxt: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#195FBA'
  }
});
