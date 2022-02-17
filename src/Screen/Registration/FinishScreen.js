import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {Feather as Icon} from '@expo/vector-icons';
import axios from 'axios';
import {Endpoint} from '../../Utils/Endpoint';
import * as fs from 'expo-file-system';
import SubHeader from '../../Component/SubHeader';
import SubmitButton from '../../Component/SubmitButton';

const FinishScreen = ({route}) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const getDataset = async () => {
    let data = [];
    try {
      const res = await axios.get(Endpoint.GetDataset);
      if (res) {
        data = res.data.data;
        return data;
      }
    } catch (error) {
      console.log(error, 'error');
      return data;
    }
  };

  const createJsonUser = async () => {
    const dirPath = fs.documentDirectory;
    const UserJsonPath = dirPath + 'User.json';
    const info = await fs.getInfoAsync(UserJsonPath);
    const data = await getDataset();
    const objectedData = data.map(item =>
      JSON.parse(item.labeledFaceDescriptors),
    );
    const write = await fs.writeAsStringAsync(
      UserJsonPath,
      JSON.stringify(objectedData),
    );
    console.log(info, UserJsonPath);
  };

  useEffect(() => {
    createJsonUser();
  }, [isFocused]);

  return (
    <>
      <StatusBar translucent={false} backgroundColor={'#195FBA'} />
      <SubHeader title={'Beranda'} />
      <View style={styles.container}>
        <View style={styles.body}>
          <Text>Finish Screen</Text>
        </View>
        <SubmitButton
          title={'Home'}
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </>
  );
};

export default FinishScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    paddingVertical: 25,
    justifyContent: 'space-between',
  },
  body: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
});
