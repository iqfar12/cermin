import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TakePictureRecognition from './TakePictureRecognition';
import PreviewRecognition from './PreviewRecognition';

const StackNavigator = createNativeStackNavigator();

const RecognitionScreen = () => {
  return (
    <StackNavigator.Navigator screenOptions={{headerShown: false}}>
      <StackNavigator.Screen
        name={'Take Picture Recognition'}
        component={TakePictureRecognition}
      />
      <StackNavigator.Screen
        name={'Preview Recognition'}
        component={PreviewRecognition}
      />
    </StackNavigator.Navigator>
  );
};

export default RecognitionScreen;
