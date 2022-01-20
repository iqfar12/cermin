import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';
import {ic_no_internet} from '../assets';
import {Fonts} from '../Utils/Fonts';
import SubmitButton from './SubmitButton';

const NoConnectionModal = ({onClose, visible}) => {
  return (
    <Modal visible={visible} transparent>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.container}
      >
        <View style={styles.wrapper}>
          <View style={styles.icon}>
            <Image source={ic_no_internet} style={styles.image} />
          </View>
          <Text style={styles.message}>
            Tidak ada Koneksi {'\n'}Harap Nyalakan Koneksi Internet untuk
            Melanjutkan
          </Text>
          <SubmitButton title={'Oke'} onPress={onClose} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default NoConnectionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  wrapper: {
    backgroundColor: '#FFF',
    paddingVertical: 20,
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  icon: {
    width: '50%',
    height: undefined,
    aspectRatio: 1 / 1,
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  message: {
    paddingHorizontal: 10,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: Fonts.book,
    color: '#000',
    marginBottom: 15,
  },
});
