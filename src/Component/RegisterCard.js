import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Fonts} from '../Utils/Fonts';

const RegisterCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.name}>Asep Zaenudin</Text>
        <Text style={styles.code}>31265357</Text>
      </View>
      <View style={styles.right}>
        <View style={styles.label}>
          <Text style={styles.labelTxt}>Belum Sinkron</Text>
        </View>
      </View>
    </View>
  );
};

export default RegisterCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  name: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#383636',
  },
  code: {
    fontFamily: Fonts.book,
    fontSize: 16,
    color: '#383636',
  },
  labelTxt: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#E2A51F',
  },
  label: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#FFF6E2',
    borderColor: '#FFD477',
  },
});
