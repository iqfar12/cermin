import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Fonts} from '../Utils/Fonts';

const SubmitButton = ({onPress, title, disabled}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, disabled && styles.disabled]}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#195FBA',
    marginHorizontal: 30,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DADADA',
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.book,
    color: '#FFF',
  },
  disabled: {
    backgroundColor: '#6C6C6C',
  },
});
