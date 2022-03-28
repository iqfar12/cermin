import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Fonts} from '../Utils/Fonts';

const PermittedCard = ({name, code}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.code}>{code}</Text>
    </View>
  );
};

export default PermittedCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 20,
    marginRight: 10,
    paddingRight: 40,
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
});
