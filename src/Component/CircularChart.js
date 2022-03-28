import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

const CircularChart = ({progress = 10, size = 100, color = '#6DA9F7'}) => {
  return (
    <>
      <AnimatedCircularProgress
        size={size}
        width={5}
        fill={progress}
        tintColor={color}
        backgroundColor="rgba(136, 136, 136, 0.2)"
        dashedBackground={{width: 10, gap: 0}}
        dashedTint={{width: 15, gap: 0}}
        rotation={0}
      />
    </>
  );
};

export default CircularChart;

const styles = StyleSheet.create({});
