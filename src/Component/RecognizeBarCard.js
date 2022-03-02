import React, { useMemo } from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Fonts} from '../Utils/Fonts';
import Icon from '@expo/vector-icons/MaterialIcons';
import TaskServices from '../Database/TaskServices';

const RecognizeBarCard = ({onPress, data = []}) => {
  const user = TaskServices.getCurrentUser();
  const MasterEmployee = TaskServices.getAllData('TM_EMPLOYEE');
  const ListEmployee = useMemo(() => {
    const res = MasterEmployee
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
    return data
  }, [MasterEmployee])
  const isRegister = Math.floor((data.length / ListEmployee.length) * 100);
  const percentage = 100 - isRegister;
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.container}>
      <View style={styles.left}>
        <Icon name={'group'} size={20} color={'#FFFFFF'} />
        <Text style={styles.num}>{data.length}</Text>
      </View>
      <View style={styles.mid}>
        <Text style={styles.inActiveNum}>Belum didaftarkan</Text>
        <View style={styles.barContainer}>
          <View style={[styles.bar, {width: `${percentage}%`}]} />
        </View>
      </View>
      <View style={styles.right}>
        <Icon name={'chevron-right'} size={25} color={'#FFF'} />
      </View>
    </TouchableOpacity>
  );
};

export default RecognizeBarCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#195FBA',
    padding: 15,
    elevation: 0.5,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000',
  },
  buttonTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#2F78D7',
  },
  button: {
    paddingHorizontal: 10,
  },
  barContainer: {
    height: '5%',
    width: '100%',
    backgroundColor: '#C5C5C5',
    marginVertical: 15,
    borderRadius: 10,
    position: 'relative',
    justifyContent: 'center',
  },
  bar: {
    height: '150%',
    backgroundColor: '#FFF',
    position: 'absolute',
    borderRadius: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomTxt: {
    fontFamily: Fonts.book,
    color: '#000',
    marginLeft: 12,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeNum: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#000',
  },
  inActiveNum: {
    fontSize: 16,
    fontFamily: Fonts.book,
    color: '#FFF',
  },
  num: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: '#FFF',
    marginHorizontal: 5,
  },
  mid: {
    flex: 1,
    marginHorizontal: 20,
  }
});
