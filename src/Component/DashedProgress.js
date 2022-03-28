import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

const DashedProgress = ({progress = 0}) => {
  return (
    <>
      <AnimatedCircularProgress
        size={300}
        width={10}
        fill={progress}
        tintColor={progress >= 100 ? '#00B577' : '#0E5CBE'}
        backgroundColor="rgba(136, 136, 136, 0.2)"
        dashedBackground={{width: 10, gap: 5}}
        dashedTint={{width: 10, gap: 5}}
        rotation={0}
      />
    </>
  );
};

export default DashedProgress;

const styles = StyleSheet.create({});
