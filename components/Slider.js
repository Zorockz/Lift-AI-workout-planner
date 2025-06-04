import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { COLORS, FONTS, SPACING } from '../utils/constants';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - (SPACING.lg * 2);

const CustomSlider = ({ value, onValueChange, minimumValue, maximumValue, step }) => {
  const renderTickMarks = () => {
    const ticks = [];
    for (let i = minimumValue; i <= maximumValue; i += step) {
      ticks.push(
        <View key={i} style={styles.tickContainer}>
          <View style={styles.tick} />
          <Text style={styles.tickLabel}>{i}</Text>
        </View>
      );
    }
    return ticks;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.value}>{Math.round(value)}</Text>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          step={step}
          value={value}
          onValueChange={onValueChange}
          minimumTrackTintColor={COLORS.primary}
          maximumTrackTintColor="#E5E5E5"
          thumbTintColor={COLORS.primary}
        />
        <View style={styles.tickMarksContainer}>
          {renderTickMarks()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  value: {
    fontSize: 72,
    ...FONTS.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xl,
  },
  sliderContainer: {
    width: SLIDER_WIDTH,
    height: 60,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  tickMarksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  tickContainer: {
    alignItems: 'center',
  },
  tick: {
    width: 2,
    height: 8,
    backgroundColor: COLORS.textLight,
    marginBottom: 4,
  },
  tickLabel: {
    fontSize: 14,
    ...FONTS.medium,
    color: COLORS.textLight,
  },
});

export default CustomSlider; 