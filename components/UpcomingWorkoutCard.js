import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const UpcomingWorkoutCard = ({ date, exercises = [], onSeeFullPlan }) => (
  <View style={styles.card}>
    <View style={styles.headerRow}>
      <Text style={styles.title}>Upcoming Workout</Text>
    </View>
    <Text style={styles.date}>{date}</Text>
    <View style={styles.exerciseList}>
      {exercises.slice(0, 3).map((ex, idx) => (
        <Text key={idx} style={styles.exerciseItem}>• {ex.name} {(
          Number.isFinite(Number(ex.sets)) && Number(ex.sets) > 0 &&
          Number.isFinite(Number(ex.reps)) && Number(ex.reps) > 0
        )
          ? `(${ex.sets}x${ex.reps})`
          : (Number.isFinite(Number(ex.duration)) && Number(ex.duration) > 0)
            ? `(${ex.duration} min)`
            : ''}
        </Text>
      ))}
    </View>
    <TouchableOpacity style={styles.seeFullPlanButton} onPress={onSeeFullPlan}>
      <Text style={styles.seeFullPlanText}>See Full Plan</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E5EA',
    shadowColor: '#2075FF11',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B365D',
  },
  date: {
    fontSize: 13,
    color: '#6C7580',
    marginBottom: 6,
  },
  exerciseList: {
    marginTop: 4,
  },
  exerciseItem: {
    fontSize: 14,
    color: '#1B365D',
    marginBottom: 2,
  },
  seeFullPlanButton: {
    marginTop: 14,
    backgroundColor: '#2075FF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    width: '100%',
  },
  seeFullPlanText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default UpcomingWorkoutCard; 