import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';

const LoadingModal = props => {
  return (
    <Modal transparent={true} visible={true}>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <ActivityIndicator size={'large'} color={'#000'} />
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
});
