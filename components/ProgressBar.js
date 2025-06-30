import { View, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

const ProgressBar = ({ currentStep, totalSteps, style }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const progress = currentStep / totalSteps;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep, totalSteps, progressAnim]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.background}>
        <Animated.View
          style={[
            styles.progress,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
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
  background: {
    height: 4,
    backgroundColor: '#E2E5EA',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#2075FF',
    borderRadius: 2,
  },
});

export default ProgressBar; 