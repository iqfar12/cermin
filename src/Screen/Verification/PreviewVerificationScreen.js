import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const PreviewVerificationScreen = ({route}) => {
  const navigation = useNavigation();
  const {data, image, label} = route.params;
  console.log(label, data?.label);
  return (
    <>
      <StatusBar backgroundColor={'#0E5CBE'} />
      <View style={styles.header}>
        <Text style={styles.title}>Hasil Pengenalan Wajah</Text>
      </View>
      <View style={styles.container}>
        {image?.uri && (
          <View style={styles.previewImage}>
            <Image style={styles.image} source={image} />
          </View>
        )}
        <View style={styles.body}>
          {data !== undefined && data.label == label ? (
            <Text style={styles.label}>
              Selamat Datang, <Text style={styles.bold}>{data?.label}</Text>
            </Text>
          ) : (
            <Text style={styles.label}>Data Wajah Tidak Cocok</Text>
          )}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.buttonTitle}>Oke</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.buttonContainer}></View> */}
      </View>
    </>
  );
};

export default PreviewVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  previewImage: {
    width: '75%',
    height: undefined,
    aspectRatio: 9 / 16,
    alignItems: 'center',
    alignSelf: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  body: {
    padding: 20,
  },
  label: {
    fontSize: 30,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#0E5CBE',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 10,
  },
  buttonTitle: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#0E5CBE',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    position: 'relative',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});
