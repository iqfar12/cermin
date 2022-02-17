import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainRegisterScreen from './TabScreen/MainRegisterScreen';
import MainAttendanceScreen from './TabScreen/MainAttendanceScreen';
import {StyleSheet, Text} from 'react-native';
import {Fonts} from '../../../Utils/Fonts';
import Icon from '@expo/vector-icons/MaterialIcons';

const TabNavigator = createBottomTabNavigator();

const HomeTabNavigator = () => {
  return (
    <TabNavigator.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#195FBA',
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarItemStyle: styles.tab,
        tabBarStyle: styles.main,
      }}
    >
      <TabNavigator.Screen
        name={'Registrasi'}
        component={MainRegisterScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name={'groups'}
              size={25}
              color={focused ? '#195FBA' : '#A0A0A0'}
            />
          ),
          tabBarLabel: ({focused, color}) => (
            <Text
              style={[
                focused ? styles.labelBold : styles.label,
                {color: color},
              ]}
            >
              Registrasi
            </Text>
          ),
        }}
      />
      <TabNavigator.Screen
        name={'Kehadiran'}
        component={MainAttendanceScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name={'event-available'}
              size={25}
              color={focused ? '#195FBA' : '#A0A0A0'}
            />
          ),
          tabBarLabel: ({focused, color}) => (
            <Text
              style={[
                focused ? styles.labelBold : styles.label,
                {color: color},
              ]}
            >
              Kehadiran
            </Text>
          ),
        }}
      />
    </TabNavigator.Navigator>
  );
};

export default HomeTabNavigator;

const styles = StyleSheet.create({
  label: {
    fontFamily: Fonts.book,
    fontSize: 14,
  },
  labelBold: {
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
  tab: {
    paddingBottom: 10,
    paddingTop: 15,
  },
  main: {
    height: '10%',
  },
});
