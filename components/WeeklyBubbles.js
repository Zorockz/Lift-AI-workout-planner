import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const bubbles = [
  { label: 'Strength', icon: 'dumbbell', color: '#2075FF' },
  { label: 'Cardio', icon: 'run', color: '#E65100' },
  { label: 'Flexibility', icon: 'yoga', color: '#43A047' },
];

const WeeklyBubbles = ({ onSelect, selected }) => (
  <View style={styles.container}>
    {bubbles.map((bubble, idx) => (
      <TouchableOpacity
        key={bubble.label}
        style={[
          styles.bubble,
          selected === bubble.label && { backgroundColor: bubble.color + '22' },
        ]}
        onPress={() => onSelect && onSelect(bubble.label)}
      >
        <MaterialCommunityIcons name={bubble.icon} size={24} color={bubble.color} />
        <Text style={styles.label}>{bubble.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E5EA',
  },
  bubble: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    minWidth: 80,
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: '#1B365D',
    fontWeight: '500',
  },
});

export default WeeklyBubbles; 