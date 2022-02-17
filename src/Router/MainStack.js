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
import TakePictureLeave from '../Screen/Agenda/TakePictureLeave';
import PreviewPictureLeave from '../Screen/Agenda/PreviewPictureLeave';
import AttendanceOut from '../Screen/Attendance Out/AttendanceOut';
import PreviewAttendanceOut from '../Screen/Attendance Out/PreviewAttendanceOut';
import AttendanceRest from '../Screen/Attendance Rest/AttendanceRest';
import PreviewAttendanceRest from '../Screen/Attendance Rest/PreviewAttendanceRest';
import HistoryAttendance from '../Screen/History/HistoryAttendance';
import HistoryAgenda from '../Screen/History/HistoryAgenda';
import DetailHistoryAttendance from '../Screen/History/DetailHistoryAttendance';

const StackNavigator = createNativeStackNavigator();

const MainStackNavigator = () => {
  const lingking = {
    prefixes: [
      'cerminapp://',
    ],
  };
  return (
    <NavigationContainer linking={lingking}>
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
          name={'Verification'}
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
        <StackNavigator.Screen
          name={'History Attendance'}
          component={HistoryAttendance}
        />
        <StackNavigator.Screen
          name={'History Agenda'}
          component={HistoryAgenda}
        />
        <StackNavigator.Screen
          name={'Detail History Attendance'}
          component={DetailHistoryAttendance}
        />
        <StackNavigator.Screen name={'Profile'} component={ProfileScreen} />
        <StackNavigator.Screen name={'Login'} component={LoginScreen} />
        <StackNavigator.Screen name={'Sync'} component={SyncScreen} />
        <StackNavigator.Screen name={'Leave'} component={LeaveScreen} />
        <StackNavigator.Screen name={'Take Picture Leave'} component={TakePictureLeave} />
        <StackNavigator.Screen name={'Preview Picture Leave'} component={PreviewPictureLeave} />
        <StackNavigator.Screen name={'Attendance Out'} component={AttendanceOut} />
        <StackNavigator.Screen name={'Preview Attendance Out'} component={PreviewAttendanceOut} />
        <StackNavigator.Screen name={'Attendance Rest'} component={AttendanceRest} />
        <StackNavigator.Screen name={'Preview Attendance Rest'} component={PreviewAttendanceRest} />

     </StackNavigator.Navigator>
    </NavigationContainer>
  );
};

export default MainStackNavigator;
