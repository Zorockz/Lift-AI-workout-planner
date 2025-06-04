import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/constants';

const GoalCard = ({ title, description, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text style={[styles.title, isSelected && styles.selectedText]}>
          {title}
        </Text>
        <Text style={[styles.description, isSelected && styles.selectedText]}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedContainer: {
    backgroundColor: COLORS.primary,
  },
  content: {
    gap: SPACING.xs,
  },
  title: {
    fontSize: 18,
    ...FONTS.bold,
    color: COLORS.text,
  },
  description: {
    fontSize: 14,
    ...FONTS.regular,
    color: COLORS.textLight,
  },
  selectedText: {
    color: COLORS.background,
  },
});

export default GoalCard; 