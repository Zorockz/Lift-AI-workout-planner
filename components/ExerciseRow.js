import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../utils/styles';

const ExerciseRow = ({ exercise, index }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  if (exercise === "Rest Day") {
    return (
      <View style={styles.restDayContainer}>
        <Text style={styles.restDayText}>Rest Day</Text>
        <Text style={styles.restDaySubtext}>Recovery is crucial for progress</Text>
      </View>
    );
  }

  return (
    <View style={styles.exerciseContainer}>
      <View style={styles.exerciseHeader}>
        <View style={styles.typeAndToggle}>
          <Text style={[
            styles.exerciseType,
            exercise.type === "Warm-up" ? styles.warmupType : styles.mainType
          ]}>
            {exercise.type}
          </Text>
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={() => setIsCompleted(!isCompleted)}
          >
            <MaterialCommunityIcons
              name={isCompleted ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
              size={24}
              color={isCompleted ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
      </View>
      <Text style={[
        styles.exerciseName,
        isCompleted && styles.completedExercise
      ]}>
        {exercise.name}
      </Text>
      {exercise.type === "Main" && (
        <View style={styles.exerciseDetails}>
          <Text style={[
            styles.exerciseDetail,
            isCompleted && styles.completedExercise
          ]}>
            {exercise.sets} sets × {exercise.reps} reps
          </Text>
          <Text style={[
            styles.exerciseDetail,
            isCompleted && styles.completedExercise
          ]}>
            Rest: {exercise.rest} seconds
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  exerciseContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E5EA',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeAndToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exerciseType: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  warmupType: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
  },
  mainType: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
  },
  toggleButton: {
    padding: 4,
  },
  exerciseDuration: {
    fontSize: 14,
    color: '#6C7580',
  },
  exerciseName: {
    fontSize: 16,
    color: '#1B365D',
    fontWeight: '600',
    marginBottom: 8,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#6C7580',
  },
  completedExercise: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  restDayContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  restDayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 4,
  },
  restDaySubtext: {
    fontSize: 14,
    color: '#6C7580',
  },
});

export default ExerciseRow; 