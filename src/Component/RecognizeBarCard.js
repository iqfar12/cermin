import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Fonts} from '../Utils/Fonts';
import Icon from '@expo/vector-icons/MaterialIcons';

const RecognizeBarCard = ({onPress}) => {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>Pengenalan Wajah</Text>
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.button}>
          <Text style={styles.buttonTitle}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mid}>
        <View style={[styles.bar, {width: '70%'}]} />
      </View>
      <View style={styles.bottom}>
        <View style={styles.left}>
          <Icon name={'people'} size={25} color={'#195FBA'} />
          <Text style={styles.bottomTxt}>
            <Text style={{fontFamily: Fonts.bold}}>38 </Text>
            belum terdaftar
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.activeNum}>86</Text>
          <Text style={styles.inActiveNum}> / 124</Text>
        </View>
      </View>
    </View>
  );
};

export default RecognizeBarCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    padding: 15,
    elevation: 0.5,
    borderRadius: 20,
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
  mid: {
    height: '5%',
    width: '100%',
    backgroundColor: '#DADADA',
    marginVertical: 15,
    borderRadius: 10,
    position: 'relative',
    justifyContent: 'center',
  },
  bar: {
    height: '150%',
    backgroundColor: '#195FBA',
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
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: '#DADADA',
  },
});
