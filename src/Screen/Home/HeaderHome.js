import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {Person} from '../../assets';
import {Fonts} from '../../Utils/Fonts';
import Icon from '@expo/vector-icons/MaterialIcons';

const HeaderHome = ({onSetting, onSync, User}) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={Person} style={styles.image} />
        </View>
        <View style={styles.right}>
          <View style={styles.nameWrapper}>
            <Text style={styles.role} numberOfLines={1} ellipsizeMode={'tail'}>
              {User.NAME}
            </Text>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>
              {User.REFERENCE_LOCATION}
            </Text>
          </View>
        </View>
        <View style={styles.icon}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onSetting}
            style={styles.dropDown}
          >
            <Icon name={'settings'} size={25} color={'#FFF'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSync}
            activeOpacity={0.8}
            style={styles.notif}
          >
            <Icon name={'sync'} size={30} color={'#FFF'} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default HeaderHome;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#195FBA',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    padding: 15,
  },
  imageContainer: {
    width: '15%',
    height: undefined,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1 / 1,
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 10,
    marginRight: 10,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  role: {
    color: '#FFF',
    fontFamily: Fonts.book,
  },
  name: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  dropDown: {
    paddingRight: 15,
  },
  notif: {
    paddingLeft: 15,
    borderLeftWidth: 1,
    borderColor: '#FFF',
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
});
