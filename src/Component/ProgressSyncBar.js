import React from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {Fonts} from '../Utils/Fonts';
import Icon from '@expo/vector-icons/MaterialIcons';

const ProgressSyncBar = ({title, progress, total, sync}) => {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.corner}>
          <Icon name={'folder'} size={25} color={'#93BBE4'} />
          <Text style={styles.name}>{title}</Text>
        </View>
        <View style={styles.corner}>
          <Text style={{marginRight: 7}}>
            <Text style={styles.progressTxt}>{sync ? progress : 0}</Text>
            <Text style={sync ? styles.name : styles.progressTxt}>
              /{total}
            </Text>
          </Text>
          {!sync ? (
            <Icon name={'check'} size={25} color={'#195FBA'} />
          ) : (
            <ActivityIndicator size={'small'} color={'#DADADA'} />
          )}
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={styles.bar}>
          {sync ? (
            <View
              style={[styles.progress, {width: `${(progress / total) * 100}%`}]}
            />
          ) : (
            <View style={[styles.progress, {width: `0%`}]} />
          )}
        </View>
      </View>
    </View>
  );
};

export default ProgressSyncBar;

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontFamily: Fonts.bold,
    color: '#797676',
    marginLeft: 7,
  },
  bar: {
    backgroundColor: '#DADADA',
    borderRadius: 100,
    height: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#195FBA',
    borderRadius: 100,
  },
  container: {
    marginBottom: 10,
  },
  progressTxt: {
    fontFamily: Fonts.bold,
    marginRight: 10,
    color: '#195FBA',
  },
  corner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
