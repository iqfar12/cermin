import React, {useState} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import {Fonts} from '../../../../Utils/Fonts';
import AttendanceCard from '../../../../Component/AttendanceCard';
import Icon from '@expo/vector-icons/MaterialIcons';

const DummyData = [
  {
    name: 'Asep Zaenudin',
    code: '1234B- 31265357',
    timeIn: '15:00',
    timeOut: '18:23',
  },
  {
    name: 'Asep Zaenudin',
    code: '1234B- 31265357',
    timeIn: '15:00',
    timeOut: '18:23',
  },
  {
    name: 'Asep Zaenudin',
    code: '1234B- 31265357',
    timeIn: '15:00',
    timeOut: undefined,
  },
  {
    name: 'Asep Zaenudin',
    code: '1234B- 31265357',
    timeIn: '15:00',
    timeOut: undefined,
  },
  {
    name: 'Asep Zaenudin',
    code: '1234B- 31265357',
    timeIn: '15:00',
    timeOut: '18:23',
  },
  {
    name: 'Asep Zaenudin',
    code: '1234B- 31265357',
    timeIn: '15:00',
    timeOut: '18:23',
  },
  {
    name: 'Asep Zaenudin',
    code: '1234B- 31265357',
    timeIn: '15:00',
    timeOut: '18:23',
  },
  {
    name: 'Asep Zaenudin',
    code: '1234B- 31265357',
    timeIn: '15:00',
    timeOut: '18:23',
  },
  {
    name: 'Asep Zaenudin',
    code: '1234B- 31265357',
    timeIn: '15:00',
    timeOut: '18:23',
  },
];

const MainAttendanceScreen = () => {
  const [show, setShow] = useState(true);
  let offset;
  const renderListAttendance = ({item, index}) => {
    return (
      <AttendanceCard
        key={index}
        name={item.name}
        code={item.code}
        timeIn={item.timeIn}
        timeOut={item.timeOut}
      />
    );
  };

  const onScroll = event => {
    // console.log(event.nativeEvent.contentOffset.y)
    const minOffset = 5;
    const prevset = offset;
    let currentOffset = event.nativeEvent.contentOffset.y;
    let direction = currentOffset > offset ? 'down' : 'up';
    offset = currentOffset;
    if (
      direction === 'down' &&
      currentOffset - minOffset > prevset &&
      currentOffset !== 0
    ) {
      setShow(false);
    } else if (
      (direction === 'up' && currentOffset + minOffset > prevset) ||
      currentOffset === 0
    ) {
      setShow(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.markContainer}>
        <View style={styles.mark}>
          <Text style={styles.markTitle}>Absen Masuk</Text>
          <Text style={styles.markCount}>52</Text>
        </View>
        <View style={styles.mark}>
          <Text style={styles.markTitle}>Absen Pulang</Text>
          <Text style={styles.markCount}>24</Text>
        </View>
      </View>
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderTitle}>Kehadiran</Text>
        <Text style={styles.listHeaderTitle}>Jam Masuk - Pulang</Text>
      </View>
      <FlatList
        data={DummyData}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderListAttendance}
        contentContainerStyle={styles.flatList}
        onScroll={onScroll}
        showsVerticalScrollIndicator={false}
      />

      {show && (
        <TouchableOpacity activeOpacity={0.8} style={styles.floatingButton}>
          <Text style={styles.buttonTitle}>Ambil Foto Kehadiran</Text>
          <Icon name={'photo-camera'} size={25} color={'#FFF'} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MainAttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    position: 'relative',
  },
  mark: {
    backgroundColor: '#2F78D7',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 54, 54, 0.1)',
  },
  markContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  markTitle: {
    fontSize: 16,
    fontFamily: Fonts.book,
    color: '#FFF',
    textAlign: 'center',
  },
  markCount: {
    fontSize: 48,
    fontFamily: Fonts.bold,
    color: '#FFF',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  listHeaderTitle: {
    fontFamily: Fonts.bold,
    color: '#A0A0A0',
  },
  flatList: {
    paddingBottom: 10,
  },
  floatingButton: {
    backgroundColor: '#195FBA',
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
    borderRadius: 24,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },
  buttonTitle: {
    fontFamily: Fonts.book,
    fontSize: 18,
    color: '#FFF',
    marginRight: 12,
  },
});
