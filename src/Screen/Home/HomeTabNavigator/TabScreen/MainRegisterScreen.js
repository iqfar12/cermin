import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import {Fonts} from '../../../../Utils/Fonts';
import RegisterCard from '../../../../Component/RegisterCard';
import Icon from '@expo/vector-icons/MaterialIcons';

const dummy = [
  {
    id: 0,
  },
  {
    id: 0,
  },
  {
    id: 0,
  },
  {
    id: 0,
  },
  {
    id: 0,
  },
  {
    id: 0,
  },
  {
    id: 0,
  },
  {
    id: 0,
  },
];

const MainRegisterScreen = () => {
  const [selected, setSelected] = useState(true);
  const [show, setShow] = useState(true);

  const renderListAttendance = ({item, index}) => {
    return <RegisterCard />;
  };

  useEffect(() => {
    setShow(true);
  }, [selected]);

  let offset;
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
      <View style={styles.tabContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSelected(true)}
          style={[styles.tab, selected && styles.selected]}
        >
          <Text style={!selected ? styles.tabTitle : styles.selectedTabTitle}>
            Tertunda (128)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSelected(false)}
          style={[styles.tab, !selected && styles.selectedRight]}
        >
          <Text style={selected ? styles.tabTitle : styles.selectedTabTitle}>
            Terdaftar (23)
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nama Lengkap</Text>
        <Text style={styles.headerTitle}>Nomor Induk Karyawan</Text>
      </View>
      <FlatList
        data={dummy}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderListAttendance}
        contentContainerStyle={styles.flatlist}
        onScroll={onScroll}
        showsVerticalScrollIndicator={false}
      />

      {show && (
        <TouchableOpacity activeOpacity={0.8} style={styles.floatingButton}>
          <Text style={styles.buttonTitle}>Daftar Baru</Text>
          <Icon name={'person-add-alt-1'} size={25} color={'#FFF'} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MainRegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  selected: {
    backgroundColor: '#FFF',
    borderRightWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderTopRightRadius: 15,
  },
  selectedRight: {
    backgroundColor: '#FFF',
    borderLeftWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderTopLeftRadius: 15,
  },
  tabTitle: {
    fontSize: 16,
    fontFamily: Fonts.book,
    color: '#797676',
  },
  selectedTabTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#383636',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 0.2,
    borderBottomWidth: 1,
    borderColor: '#DADADA',
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#A0A0A0',
  },
  flatlist: {
    paddingBottom: 30,
    paddingTop: 12,
    backgroundColor: '#FFF',
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
