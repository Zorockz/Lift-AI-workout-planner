import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TodayWorkoutCard = ({ exercises = [], onStart, renderFooter }) => (
  <View style={styles.card}>
    <Text style={styles.title}>Today's Workout</Text>
    {exercises.length === 0 ? (
      <Text style={styles.noWorkout}>No workout scheduled for today.</Text>
    ) : (
      <View style={styles.exerciseList}>
        {exercises.map((ex, idx) => (
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
    )}
    <TouchableOpacity style={styles.startButton} onPress={onStart}>
      <Ionicons name="play" size={20} color="#fff" />
      <Text style={styles.startText}>Start Workout</Text>
    </TouchableOpacity>
    {renderFooter && (
      <View style={styles.footerContainer}>
        {renderFooter()}
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginVertical: 16,
    shadowColor: '#2075FF22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E5EA',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2075FF',
    marginBottom: 12,
  },
  noWorkout: {
    color: '#6C7580',
    fontSize: 16,
    marginBottom: 16,
  },
  exerciseList: {
    marginBottom: 16,
  },
  exerciseItem: {
    fontSize: 16,
    color: '#1B365D',
    marginBottom: 4,
  },
  startButton: {
    backgroundColor: '#2075FF',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#2075FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  footerContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
});

export default TodayWorkoutCard; 