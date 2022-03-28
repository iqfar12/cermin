import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainVerificationScreen from './MainVerificationScreen';
import PreviewVerificationScreen from './PreviewVerificationScreen';

const StackNavigator = createNativeStackNavigator();

const VerificationRouter = () => {
  return (
    <StackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackNavigator.Screen
        name={'Verification Screen'}
        component={MainVerificationScreen}
      />
      <StackNavigator.Screen
        name={'Preview Verification'}
        component={PreviewVerificationScreen}
      />
    </StackNavigator.Navigator>
  );
};

export default VerificationRouter;
