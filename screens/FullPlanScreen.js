import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FullPlanScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { plan } = route.params || {};

  const renderExercise = (exercise, index) => {
    if (exercise === "Rest Day") {
      return (
        <View key={index} style={styles.restDayContainer}>
          <Text style={styles.restDayText}>Rest Day</Text>
          <Text style={styles.restDaySubtext}>Recovery is crucial for progress</Text>
        </View>
      );
    }
    return (
      <View key={index} style={styles.exerciseContainer}>
        <View style={styles.exerciseHeader}>
          <Text style={[
            styles.exerciseType,
            exercise.type === "Warm-up" ? styles.warmupType : styles.mainType
          ]}>
            {exercise.type}
          </Text>
          <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
        </View>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        {exercise.type === "Main" && (
          <View style={styles.exerciseDetails}>
            <Text style={styles.exerciseDetail}>
              {exercise.sets} sets × {exercise.reps} reps
            </Text>
            <Text style={styles.exerciseDetail}>
              Rest: {exercise.rest} seconds
            </Text>
          </View>
        )}
      </View>
    );
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
        {plan?.weekPlan ? (
          Object.entries(plan.weekPlan).map(([day, exercises]) => (
            <View key={day} style={styles.dayCard}>
              <Text style={styles.dayTitle}>{day}</Text>
              {Array.isArray(exercises)
                ? exercises.map((exercise, index) => renderExercise(exercise, index))
                : renderExercise(exercises, 0)
              }
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
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2075FF',
    marginBottom: 16,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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

export default FullPlanScreen; 