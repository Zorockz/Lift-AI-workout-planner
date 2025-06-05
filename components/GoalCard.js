import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const GoalCard = ({ title, description, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.content}>
        <Text style={[styles.title, isSelected ? styles.selectedText : styles.unselectedText]}>
          {title}
        </Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF3366',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 8,
    minWidth: 0,
  },
  selectedContainer: {
    backgroundColor: '#FF3366',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  selectedText: {
    color: '#FFFFFF',
  },
  unselectedText: {
    color: '#E0E0E0',
  },
  description: {
    fontSize: 14,
    color: '#E0E0E0',
    textAlign: 'center',
  },
});

export default GoalCard; 