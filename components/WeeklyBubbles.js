import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const colorMap = {
  workout: '#4F46E5',
  rest: '#E5E7EB',
  recovery: '#14B8A6',
  hiit: '#F97316',
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const WeeklyBubbles = ({ weekData }) => {
  return (
    <View style={styles.container}>
      <View style={styles.bubblesRow}>
        {weekData.map((day, index) => (
          <View key={index} style={styles.bubbleContainer}>
            <View 
              style={[
                styles.bubble,
                { backgroundColor: day?.type ? colorMap[day.type] : '#FFFFFF' }
              ]} 
            />
            <Text style={styles.weekdayLabel}>{WEEKDAYS[index]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  bubblesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bubbleContainer: {
    alignItems: 'center',
    gap: 4,
  },
  bubble: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  weekdayLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontFamily: 'System',
  },
});

export default WeeklyBubbles; 