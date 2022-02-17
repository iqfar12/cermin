import React from 'react';
import {StyleSheet, Text, View, Modal, TouchableOpacity} from 'react-native';

const MenuModal = ({children, visible, onClose}) => {
  return (
    <Modal visible={visible} transparent>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.container}
      >
        <View style={styles.wrapper}>{children}</View>
      </TouchableOpacity>
    </Modal>
  );
};

export default MenuModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  wrapper: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
  },
});
