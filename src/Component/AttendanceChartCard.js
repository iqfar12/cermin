import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import CircularChart from './CircularChart';
import {Calendar} from '../assets';
import {Fonts} from '../Utils/Fonts';
import Icon from '@expo/vector-icons/MaterialIcons';

const AttendanceChartCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <View style={styles.biggerChart}>
          <CircularChart size={80} progress={75} />
          <View style={styles.smallChart}>
            <CircularChart size={60} progress={67} color={'#FFD477'} />
          </View>
          <View style={styles.chartIcon}>
            <Image style={styles.image} source={Calendar} />
          </View>
        </View>
      </View>
      <View style={styles.mid}>
        <View style={styles.top}>
          <Text style={[styles.percentage, {color: '#195FBA'}]}>75%</Text>
          <Text style={styles.txt}>Absensi Masuk</Text>
        </View>
        <View style={styles.bottom}>
          <Text style={[styles.percentage, {color: '#FFB81C'}]}>67%</Text>
          <Text style={styles.txt}>Absensi Lengkap</Text>
        </View>
      </View>
      <TouchableOpacity activeOpacity={0.8} style={styles.right}>
        <Icon name={'keyboard-arrow-right'} size={25} color={'#2F78D7'} />
      </TouchableOpacity>
    </View>
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
