import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Fonts} from '../Utils/Fonts';

const AttendanceCard = ({name, code, timeIn, timeOut}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View
          style={[
            styles.indicator,
            {backgroundColor: timeOut ? '#195FBA' : '#FFB81C'},
          ]}
        />
        <View style={styles.person}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.code}>{code}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.time}>{timeIn} - </Text>
        <Text style={styles.time}>{timeOut || '--:--'}</Text>
      </View>
    </View>
  );
};

export default AttendanceCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
  },
  indicator: {
    width: '5%',
    borderRadius: 5,
    marginRight: 12,
  },
  person: {
    marginVertical: 14,
  },
  name: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#383636',
  },
  code: {
    fontSize: 16,
    fontFamily: Fonts.book,
    color: '#383636',
  },
  time: {
    fontFamily: Fonts.book,
    fontSize: 24,
    color: '#383636',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
});
