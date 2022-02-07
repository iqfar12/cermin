import React, { useMemo, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { BackgroundHome } from '../../assets';
import { Fonts } from '../../Utils/Fonts';
import { MonthName } from '../../Utils/DateHelper';
import AttendanceChartCard from '../../Component/AttendanceChartCard';
import RecognizeBarCard from '../../Component/RecognizeBarCard';
import PermittedCard from '../../Component/PermittedCard';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import SyncNotif from '../../Component/SyncNotif';
import TaskServices from '../../Database/TaskServices';

const Dummy = [
  {
    name: 'Asep Zaenudin',
    code: '1234B- 31265357',
  },
  {
    name: 'Asep Zaenudin',
    code: '1234B- 31265357',
  },
  {
    name: 'Asep Zaenudin',
    code: '1234B- 31265357',
  },
  {
    name: 'Asep Zaenudin',
    code: '1234B- 31265357',
  },
  {
    name: 'Asep Zaenudin',
    code: '1234B- 31265357',
  },
];

const HomeContent = () => {
  const navigation = useNavigation();
  const [sync, setSync] = useState(true);
  const MasterEmployee = TaskServices.getAllData('TM_EMPLOYEE');
  const MasterAttendance = TaskServices.getAllData('TR_ATTENDANCE');
  const user = TaskServices.getCurrentUser();

  const ListAgenda = useMemo(() => {
    const res = MasterAttendance.filter((item) => item.TYPE == '4')

    return res
  }, [MasterAttendance])

  const ListNotRegisterEmployee = useMemo(() => {
    const res = MasterEmployee.filter((item) => item.REGISTER_STATUS == "NONE");
    const location = user.LOCATION.split(',');
    let data = res;
    if (user.REFERENCE_LOCATION == 'AFD') {
      data = res.filter((item) => location.includes(item.AFD_CODE))
    } else if (user.REFERENCE_LOCATION == 'BA') {
      data = res.filter((item) => location.includes(item.WERKS))
    } else if (user.REFERENCE_LOCATION == 'COMPANY') {
      data = res.filter((item) => location.includes(item.COMP_CODE))
    } else {
      // TODO: HO Need Filter!!
      data = res
    }
    return data
  }, [MasterEmployee])

  useEffect(() => {
    setTimeout(() => {
      setSync(false);
    }, 5000);
  }, []);
  const NavigationButtonList = [
    {
      iconName: 'person-add',
      title: 'Register',
      iconColor: '#195FBA',
      onNavigation: () => {
        navigation.navigate('Registration');
      },
    },
    {
      iconName: 'add-task',
      title: 'Masuk',
      iconColor: '#3D9F70',
      onNavigation: () => {
        navigation.navigate('Take Picture Recognition', { online: true });
      },
    },
    {
      iconName: 'logout',
      title: 'Pulang',
      iconColor: '#DC1B0F',
      onNavigation: () => {
        navigation.navigate('Attendance Out');
      },
    },
    {
      iconName: 'local-cafe',
      title: 'Istirahat',
      iconColor: '#FFB81C',
      onNavigation: () => {
        navigation.navigate('Attendance Rest');
      },
    },
    {
      iconName: 'article',
      title: 'Izin',
      iconColor: '#423FDA',
      onNavigation: () => {
        navigation.navigate('Leave');
      },
    },
  ];
  const [date, setDate] = useState(new Date());

  const Time = useMemo(() => {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${hours}:${minutes > 9 ? minutes : `0${minutes}`}`;
  }, [date]);

  const Day = useMemo(() => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `${day} ${MonthName(month)} ${year}`;
  }, [date]);

  useEffect(() => {
    setTimeout(() => {
      setDate(new Date());
    }, 5000);
  }, [date]);

  const renderPermittedCardList = ({ item, index }) => {
    const name = MasterEmployee.find((data) => data.ID === item.EMPLOYEE_ID)?.EMPLOYEE_FULLNAME
    const nik = MasterEmployee.find((data) => data.ID === item.EMPLOYEE_ID)?.EMPLOYEE_NIK
    return <PermittedCard name={name} code={nik} />;
  };

  const renderNavButton = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.navButton}
        onPress={item.onNavigation}
        activeOpacity={0.8}
        key={index}
      >
        <Icon name={item.iconName} size={25} color={item.iconColor} />
        <Text style={styles.navTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {sync && (
          <View style={styles.sync}>
            <SyncNotif />
          </View>
        )}
        <View style={styles.top}>
          <View style={styles.backgroundImage}>
            <Image source={BackgroundHome} style={styles.image} />
          </View>
          <View style={styles.clock}>
            <Text style={styles.date}>{Day}</Text>
            <Text style={styles.time}>{Time}</Text>
          </View>
        </View>
        <View style={styles.bottom}>
          <AttendanceChartCard onPress={() => navigation.navigate('History Attendance')} />
          <View style={styles.recognize}>
            <RecognizeBarCard data={ListNotRegisterEmployee} onPress={() => navigation.navigate('List Register')} />
          </View>
          <View style={styles.permittedContainer}>
            <View style={styles.permittedHeader}>
              <Text style={styles.permittedTitle}>Berikan Izin</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.permittedButton}
                onPress={() => navigation.navigate('History Agenda')}
              >
                <Text style={styles.permittedButtonTitle}>Lihat Semua</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={ListAgenda}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderPermittedCardList}
              horizontal={true}
              contentContainerStyle={styles.permitted}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={<PermittedCard name={'Tidak ada Data'} />}
            />
          </View>
          <View style={styles.navContainer}>
            {NavigationButtonList.map((item, index) =>
              renderNavButton(item, index),
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F78D7',
  },
  backgroundImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 4 / 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  top: {
    position: 'relative',
    // justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 20,
  },
  clock: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    marginTop: 60,
    fontSize: 24,
    fontFamily: Fonts.book,
    color: '#FFF',
  },
  time: {
    fontSize: 72,
    fontFamily: Fonts.bold,
    color: '#FFF',
  },
  bottom: {
    backgroundColor: '#F9F9F9',
    flex: 1,
    marginTop: -10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 70,
  },
  permittedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  permittedTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000',
  },
  permittedButton: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  permittedButtonTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#2F78D7',
  },
  permittedContainer: {
    marginVertical: 20,
  },
  navContainer: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 20,
    elevation: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  navTitle: {
    fontSize: 12,
    fontFamily: Fonts.book,
    color: '#4E4C4C',
  },
  sync: {
    position: 'absolute',
    width: '100%',
  }
});
