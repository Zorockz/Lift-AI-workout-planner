import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const FullPlanScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { plan } = route.params || {};

  const renderExercise = (exercise, index) => {
    const sets = Number(exercise.sets);
    const reps = Number(exercise.reps);
    const duration = Number(exercise.duration);
    return (
      <View key={index} style={styles.exerciseContainer}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseSets}>
            {(!isNaN(sets) && !isNaN(reps) && sets > 0 && reps > 0)
              ? `${sets} sets × ${reps} reps`
              : (!isNaN(duration) && duration > 0)
                ? `${duration} min`
                : '-'}
          </Text>
        </View>
        {exercise.notes && (
          <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
        )}
        <Text style={styles.exerciseRest}>Rest: {exercise.restTime || 60}s</Text>
      </View>
    );
  };

  const handleStartWorkout = (dayKey, exercises) => {
    navigation.navigate('WorkoutSession', {
      exercises: exercises,
      dayKey: dayKey
    });
  };

  const handleGenerateNewWeek = async () => {
    try {
      const { generatePlan } = await import('../utils/planGenerator');
      const planData = plan && plan.metadata ? plan.metadata : {};
      const newPlan = await generatePlan(planData);
      if (newPlan && newPlan.weekPlan) {
        navigation.replace('FullPlan', { plan: newPlan });
      }
    } catch (error) {
      alert('Failed to generate new week workout.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1B365D" />
        </TouchableOpacity>
        <Text style={styles.title}>Full Week Plan</Text>
        <View style={styles.backButton} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {plan && plan.weekPlan ? (
          Object.entries(plan.weekPlan).map(([dayKey, dayData], idx, arr) => (
            <View key={dayKey} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{dayKey}</Text>
                <Text style={styles.dayDate}>{dayData.date || ''}</Text>
              </View>
              {dayData.type === 'rest' ? (
                <View style={styles.restDayContainer}>
                  <Ionicons name="bed-outline" size={32} color="#E65100" />
                  <Text style={styles.restDayText}>Rest Day</Text>
                  <Text style={styles.restDaySubtext}>{dayData.notes}</Text>
                </View>
              ) : (
                <>
                  <View style={styles.workoutHeader}>
                    <Ionicons name="barbell-outline" size={24} color="#2075FF" />
                    <Text style={styles.workoutTitle}>Workout</Text>
                  </View>
                  {dayData.exercises && dayData.exercises.map((exercise, index) => 
                    renderExercise(exercise, index)
                  )}
                  {dayData.notes && (
                    <Text style={styles.workoutNotes}>{dayData.notes}</Text>
                  )}
                  <TouchableOpacity 
                    style={styles.startWorkoutButton}
                    onPress={() => handleStartWorkout(dayKey, dayData.exercises)}
                  >
                    <Ionicons name="play" size={20} color="#fff" />
                    <Text style={styles.startWorkoutText}>Start Workout</Text>
                  </TouchableOpacity>
                  {idx === arr.length - 1 && (
                    <TouchableOpacity
                      style={[styles.startWorkoutButton, { backgroundColor: '#2ECC71', marginTop: 12 }]}
                      onPress={handleGenerateNewWeek}
                    >
                      <Ionicons name="refresh" size={20} color="#fff" />
                      <Text style={styles.startWorkoutText}>Generate New Week Workout</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.planText}>No plan data.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E5EA',
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#1B365D',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 24,
  },
  planText: {
    fontSize: 18,
    color: '#1B365D',
    textAlign: 'center',
  },
  dayCard: {
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#2075FF22',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2075FF',
  },
  dayDate: {
    fontSize: 14,
    color: '#6C7580',
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B365D',
    marginLeft: 8,
  },
  exerciseContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E5EA',
  },
  exerciseHeader: {
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    color: '#1B365D',
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseSets: {
    fontSize: 14,
    color: '#2075FF',
    fontWeight: '500',
  },
  exerciseNotes: {
    fontSize: 14,
    color: '#6C7580',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  exerciseRest: {
    fontSize: 12,
    color: '#6C7580',
  },
  workoutNotes: {
    fontSize: 14,
    color: '#6C7580',
    fontStyle: 'italic',
    marginTop: 12,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  startWorkoutButton: {
    backgroundColor: '#2075FF',
    padding: 12,
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
  startWorkoutText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  restDayContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  restDayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
    marginTop: 8,
    marginBottom: 4,
  },
  restDaySubtext: {
    fontSize: 14,
    color: '#6C7580',
    textAlign: 'center',
  },
});

export default FullPlanScreen; 