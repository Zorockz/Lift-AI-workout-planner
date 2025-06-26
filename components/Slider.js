import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/styles';
import Slider from '@react-native-community/slider';

const CustomSlider = ({ 
  value, 
  onValueChange, 
  minimumValue = 0, 
  maximumValue = 100, 
  step = 1,
  label,
  unit = '',
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          value={value}
          onValueChange={onValueChange}
          step={step}
          minimumTrackTintColor={COLORS.primary}
          maximumTrackTintColor="#E0E0E0"
          thumbStyle={styles.thumb}
        />
        <Text style={styles.valueText}>
          {Math.round(value)}{unit}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  label: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    ...FONTS.medium,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  valueText: {
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
    minWidth: 50,
    textAlign: 'right',
    ...FONTS.medium,
  },
  thumb: {
    backgroundColor: COLORS.primary,
    width: 20,
    height: 20,
  },
});

export default CustomSlider; 