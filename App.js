import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainStackNavigator from './src/Router/MainStack';
import * as Sentry from 'sentry-expo';

export default function App() {

  Sentry.init({
    dsn: "https://f4f8812743994235a92747b17c0e5ec1@o1069352.ingest.sentry.io/6227428",
    debug: false,
    enableInExpoDevelopment: true
  })

  return (
    <MainStackNavigator />
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
