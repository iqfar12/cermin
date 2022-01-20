import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import {Fonts} from '../Utils/Fonts';

const SubHeader = ({title, onBack, right}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onBack}
        style={styles.back}
      >
        <Icon name={'chevron-left'} size={25} color={'#FFF'} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {right && right}
    </View>
  );
};

export default SubHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#195FBA',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#FFF',
    marginLeft: 20,
  },
});
