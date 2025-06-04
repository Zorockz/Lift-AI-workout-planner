import React from 'react';
import { TextInput as RNTextInput, StyleSheet, View } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/constants';

const TextInput = ({ value, onChangeText, placeholder, style, ...props }) => {
  return (
    <View style={[styles.container, style]}>
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        style={styles.input}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    padding: SPACING.md,
    fontSize: 16,
    ...FONTS.regular,
    color: COLORS.text,
  },
});

export default TextInput; 