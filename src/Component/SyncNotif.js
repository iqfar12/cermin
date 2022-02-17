import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Fonts} from '../Utils/Fonts';
import moment from 'moment';
import TaskServices from '../Database/TaskServices';

moment.locale('id');
const SyncNotif = () => {
  const user = TaskServices.getCurrentUser();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sinkron Terakhir:</Text>
      <Text style={styles.date}>
        {user.LAST_SYNC === null
          ? 'Anda Belum Sync'
          : moment(user.LAST_SYNC).format('DD MMM YYYY, HH:mm')}
      </Text>
    </View>
  );
};

export default SyncNotif;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#C5C5C5',
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.book,
    color: '#6C6C6C',
  },
  date: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
});
