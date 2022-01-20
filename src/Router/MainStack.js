import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegistrationRouter from '../Screen/Registration';
import VerificationRouter from '../Screen/Verification';
import MainVerificationScreen from '../Screen/Verification/MainVerificationScreen';
import PreviewVerificationScreen from '../Screen/Verification/PreviewVerificationScreen';
import TakePictureRecognition from '../Screen/Recognition/TakePictureRecognition';
import PreviewRecognition from '../Screen/Recognition/PreviewRecognition';
import LeaveScreen from '../Screen/Agenda';
import {
  HomeScreen,
  RecognitionScreen,
  SyncScreen,
  LoginScreen,
  SplashScreen,
  ProfileScreen,
  HistoryRegister,
} from '../Screen';
import ListRegisterScreen from '../Screen/Registration/ListRegisterScreen';

const StackNavigator = createNativeStackNavigator();

const MainStackNavigator = () => {
  return (
    <NavigationContainer>
      <StackNavigator.Navigator
        initialRouteName={'Splash'}
        screenOptions={{
          headerShown: false,
        }}
      >
        <StackNavigator.Screen name={'Splash'} component={SplashScreen} />
        <StackNavigator.Screen name={'Home'} component={HomeScreen} />
        <StackNavigator.Screen
          name={'Registration'}
          component={RegistrationRouter}
        />
        <StackNavigator.Screen
          name={'Recognition'}
          component={RecognitionScreen}
        />
        <StackNavigator.Screen
          name={'Verification Screen'}
          component={MainVerificationScreen}
        />
        <StackNavigator.Screen
          name={'Preview Verification'}
          component={PreviewVerificationScreen}
        />
        <StackNavigator.Screen
          name={'Take Picture Recognition'}
          component={TakePictureRecognition}
        />
        <StackNavigator.Screen
          name={'Preview Recognition'}
          component={PreviewRecognition}
        />
        <StackNavigator.Screen
          name={'History Register'}
          component={HistoryRegister}
        />
        <StackNavigator.Screen
          name={'List Register'}
          component={ListRegisterScreen}
        />
        <StackNavigator.Screen name={'Profile'} component={ProfileScreen} />
        <StackNavigator.Screen name={'Login'} component={LoginScreen} />
        <StackNavigator.Screen name={'Sync'} component={SyncScreen} />
        <StackNavigator.Screen name={'Leave'} component={LeaveScreen} />
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
};

export default MainStackNavigator;
