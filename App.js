import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, AppState } from 'react-native';
import MainStackNavigator from './src/Router/MainStack';
import * as Sentry from 'sentry-expo';
import { lockTimezone } from './src/Utils/StoragePermisssion';
import NetInfo from '@react-native-community/netinfo';

export default function App() {

  Sentry.init({
    dsn: "https://f4f8812743994235a92747b17c0e5ec1@o1069352.ingest.sentry.io/6227428",
    debug: false,
    enableInExpoDevelopment: true
  })

  useEffect(() => {
    const locked = async () => {
      await NetInfo.fetch();
    }
    AppState.addEventListener('change', locked)

    return () => AppState.removeEventListener('change', locked);
  }, [])

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
