import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

const OnboardingButtonRow = ({
  onBack,
  onNext,
  nextEnabled,
  backLabel = 'Back',
  nextLabel = 'Next',
  style,
}) => {
  return (
    <View style={[styles.row, style]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.85}
      >
        <Text style={styles.backButtonText}>{backLabel}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.nextButton, !nextEnabled && styles.nextButtonDisabled]}
        onPress={onNext}
        disabled={!nextEnabled}
        activeOpacity={nextEnabled ? 0.85 : 1}
      >
        <Text style={[styles.nextButtonText, !nextEnabled && styles.nextButtonTextDisabled]}>{nextLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: Platform.OS === 'ios' ? 32 : 16,
    marginTop: 24,
    gap: 16,
  },
  backButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1B365D',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#1B365D',
    fontSize: 18,
    fontWeight: '500',
  },
  nextButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#2075FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#E2E5EA',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButtonTextDisabled: {
    color: '#A3A8AF',
    fontWeight: '500',
  },
});

export default OnboardingButtonRow; 