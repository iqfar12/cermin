import React from 'react';
import {StyleSheet, Text, View, StatusBar} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FinishScreen from './FinishScreen';
import PreviewScreen from './PreviewScreen';
import RegisterScreen from './RegisterScreen';
import PreRegisterScreen from './PreRegisterScreen';
import ListRegisterScreen from './ListRegisterScreen';
const StackNavigator = createNativeStackNavigator();

const RegistrationRouter = () => {
  return (
    <StackNavigator.Navigator
      initialRouteName={'PreRegister'}
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackNavigator.Screen
        name={'Registration Home'}
        component={RegisterScreen}
      />
      <StackNavigator.Screen
        name={'Preview Screen'}
        component={PreviewScreen}
      />
      <StackNavigator.Screen
        name={'PreRegister'}
        component={PreRegisterScreen}
      />
      <StackNavigator.Screen name={'Finish Screen'} component={FinishScreen} />
    </StackNavigator.Navigator>
  );
};

export default RegistrationRouter;
