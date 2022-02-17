import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import CircularChart from './CircularChart';
import { Calendar } from '../assets';
import { Fonts } from '../Utils/Fonts';
import Icon from '@expo/vector-icons/MaterialIcons';
import TaskServices from '../Database/TaskServices';
import { dateConverter } from '../Utils/DateConverter';

const AttendanceChartCard = ({ onPress }) => {
  const MasterAttendance = TaskServices.getAllData('TR_ATTENDANCE');
  const MasterEmployee = TaskServices.getAllData('TM_EMPLOYEE');
  const user = TaskServices.getCurrentUser();

  const ListAttendance = useMemo(() => {
    const location = user.LOCATION.split(',');
    const res = MasterAttendance.map((item) => {
      const users = MasterEmployee.find((data) => data.ID == item.EMPLOYEE_ID);
      item.name = user.EMPLOYEE_FULLNAME
      item.nik = user.EMPLOYEE_NIK
      if (user.REFERENCE_LOCATION == 'AFD') {
        item.location = users.AFD_CODE;
      } else if (user.REFERENCE_LOCATION == 'BA') {
        item.location = users.WERKS
      } else if (user.REFERENCE_LOCATION == 'COMP') {
        item.location = users.COMP_CODE
      }
      return item
    }).filter((item) => {
      const absenDate = dateConverter(item.DATETIME);
      const dateNow = dateConverter(new Date());
      return absenDate === dateNow
    })
    let data = res;
    if (user.REFERENCE_LOCATION == 'AFD') {
      data = res.filter((item) => location.includes(item.location))
    } else if (user.REFERENCE_LOCATION == 'BA') {
      data = res.filter((item) => location.includes(item.location?.substr(0, 4)))
    } else if (user.REFERENCE_LOCATION == 'COMP') {
      data = res.filter((item) => location.includes(item.location?.substr(0, 2)))
    } else {
      // TODO: HO Need Filter!!
      data = res
    }
    return data
  }, [MasterAttendance])

  const GroupingListMember = useMemo(() => {
    const group = ListAttendance.reduce(function (r, a) {
      r[a.EMPLOYEE_ID] = r[a.EMPLOYEE_ID] || [];
      r[a.EMPLOYEE_ID].push(a);
      return r;
    }, Object.create(null));
    const res = Object.values(group).map((item) => {
      const attendanceIn = item.find((item) => item.TYPE == '1');
      const attendanceOut = item.find((item) => item.TYPE == '3');
      const rest = item.find((item) => item.TYPE == '2');
      const agenda = item.find((item) => item.TYPE == '4');

      return {
        NAME: item[0].name,
        LOCATION: item[0].location,
        NIK: item[0].nik,
        EMPLOYEE_ID: item[0].EMPLOYEE_ID,
        ATTENDANCE_IN: attendanceIn !== undefined ? attendanceIn.DATETIME : null,
        ATTENDANCE_OUT: attendanceOut !== undefined ? attendanceOut.DATETIME : null,
        REST: rest !== undefined ? rest.DATETIME : null,
        AGENDA: agenda !== undefined ? agenda.DATETIME : null,
      }
    });
    return res
  }, [ListAttendance]);

  const ListEmployee = useMemo(() => {
    const res = MasterEmployee.filter((item) => item.TYPE === 'E').filter((item) => item.REGISTER_STATUS == 'NONE');
    const location = user.LOCATION.split(',');
    let data = res;
    if (user.REFERENCE_LOCATION == 'AFD') {
      data = res.filter((item) => location.includes(item.AFD_CODE))
    } else if (user.REFERENCE_LOCATION == 'BA') {
      data = res.filter((item) => location.includes(item.WERKS))
    } else if (user.REFERENCE_LOCATION == 'COMP') {
      data = res.filter((item) => location.includes(item.COMP_CODE))
    } else {
      // TODO: HO Need Filter!!
      data = res
    }
    return data;
  }, [MasterEmployee])
  const AttendanceInPercentage = useMemo(() => {
    const attendanceIn = ListAttendance.filter((item) => item.TYPE == '1').map((item) => item.nik).filter((item, index, arr) => index === arr.indexOf(item))
    if (attendanceIn.length === 0) {
      return 0
    }
    const number = (attendanceIn.length / ListEmployee.length) * 100
    if (number > 100) {
      return 100
    }
    return Math.ceil(number)
  }, [ListEmployee, ListAttendance])

  const CompleteAttendance = useMemo(() => {
    const completed = GroupingListMember.filter((item) => item.ATTENDANCE_IN !== null && item.ATTENDANCE_OUT !== null && item.REST !== null)

    if (completed.length === 0) {
      return 0
    }
    const number = (completed.length / ListEmployee.length) * 100;
    if (number > 100) {
      return 100
    }
    return Math.ceil(number)
  }, [GroupingListMember, ListEmployee])

  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress} style={styles.container}>
      <View style={styles.chartContainer}>
        <View style={styles.biggerChart}>
          <CircularChart size={80} progress={AttendanceInPercentage} />
          <View style={styles.smallChart}>
            <CircularChart size={60} progress={CompleteAttendance} color={'#FFD477'} />
          </View>
          <View style={styles.chartIcon}>
            <Image style={styles.image} source={Calendar} />
          </View>
        </View>
      </View>
      <View style={styles.mid}>
        <View style={styles.top}>
          <Text style={[styles.percentage, { color: '#195FBA' }]}>{AttendanceInPercentage}%</Text>
          <Text style={styles.txt}>Absensi Masuk</Text>
        </View>
        <View style={styles.bottom}>
          <Text style={[styles.percentage, { color: '#FFB81C' }]}>{CompleteAttendance}%</Text>
          <Text style={styles.txt}>Absensi Lengkap</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Icon name={'keyboard-arrow-right'} size={25} color={'#2F78D7'} />
      </View>
    </TouchableOpacity>
  );
};

export default AttendanceChartCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    elevation: 0.5,
    flexDirection: 'row',
    padding: 10,
    borderRadius: 20,
    marginTop: -70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  smallChart: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: undefined,
    aspectRatio: 1 / 1,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  biggerChart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#DADADA',
    paddingBottom: 5,
  },
  bottom: {
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#DADADA',
  },
  txt: {
    fontSize: 16,
    fontFamily: Fonts.book,
    color: '#383636',
  },
  percentage: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    marginRight: 5,
  },
  mid: {
    paddingHorizontal: 15,
  },
  right: {
    paddingVertical: 10,
  },
});
