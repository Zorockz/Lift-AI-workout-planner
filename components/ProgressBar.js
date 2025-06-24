import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const ProgressBar = ({ currentStep = 1, totalSteps = 1 }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Validate props
  const validCurrentStep = Math.max(1, Math.min(currentStep || 1, totalSteps || 1));
  const validTotalSteps = Math.max(1, totalSteps || 1);

  useEffect(() => {
    const progress = (validCurrentStep / validTotalSteps) * 100;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [validCurrentStep, validTotalSteps]);

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View 
          style={[
            styles.fill, 
            { 
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  track: {
    height: 4,
    backgroundColor: '#E2E5EA',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#2075FF',
    borderRadius: 2,
  },
});

export default ProgressBar; 