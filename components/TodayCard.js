import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TodayCard = ({ plan, onStart }) => {
  return (
    <View style={styles.container}>
      <View style={styles.accentStripe} />
      <View style={styles.content}>
        <Text style={styles.title}>Today's Workout</Text>
        <Text style={styles.planName}>{plan.name}</Text>
        
        <View style={styles.exercisesList}>
          {plan.exercises.map((exercise, index) => (
            <Text key={index} style={styles.exerciseText}>
              <Text style={styles.exerciseNumber}>{index + 1}. </Text>
              <Text style={styles.exerciseDetails}>
                {(Number.isFinite(Number(exercise.sets)) && Number(exercise.sets) > 0 && Number.isFinite(Number(exercise.reps)) && Number(exercise.reps) > 0)
                  ? `${exercise.sets}x${exercise.reps}`
                  : (Number.isFinite(Number(exercise.duration)) && Number(exercise.duration) > 0)
                    ? `${exercise.duration} min`
                    : ''}{' '}
              </Text>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
            </Text>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.startButton}
          onPress={onStart}
        >
          <Text style={styles.startButtonText}>▶︎ Start Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 24,
  },
  accentStripe: {
    width: 4,
    backgroundColor: '#4F46E5',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'System',
  },
  planName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 24,
    fontFamily: 'System',
  },
  exercisesList: {
    marginBottom: 24,
  },
  exerciseText: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
    fontFamily: 'System',
  },
  exerciseNumber: {
    fontWeight: '600',
  },
  exerciseDetails: {
    fontWeight: '600',
    color: '#4F46E5',
  },
  exerciseName: {
    fontWeight: '400',
  },
  startButton: {
    height: 48,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
});

export default TodayCard; 