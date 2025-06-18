import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const WorkoutSessionScreen = ({ route }) => {
  const { exercises } = route.params;
  
  // State for tracking completed sets per exercise
  const [setsDoneCount, setSetsDoneCount] = useState({});
  
  // State for rest timer
  const [restTime, setRestTime] = useState(0);
  const [isResting, setIsResting] = useState(false);

  // Effect for rest timer countdown
  useEffect(() => {
    let timer;
    if (isResting && restTime > 0) {
      timer = setInterval(() => {
        setRestTime(prev => prev - 1);
      }, 1000);
    } else if (restTime === 0) {
      setIsResting(false);
    }
    return () => clearInterval(timer);
  }, [isResting, restTime]);

  // Handler for completing a set
  const handleCompleteSet = (exerciseIndex) => {
    const exercise = exercises[exerciseIndex];
    const currentSets = setsDoneCount[exerciseIndex] || 0;
    
    setSetsDoneCount(prev => ({
      ...prev,
      [exerciseIndex]: currentSets + 1
    }));

    if (currentSets + 1 < exercise.sets) {
      setRestTime(60);
      setIsResting(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#2C3E50', '#3498DB']}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Today's Workout</Text>
          <Text style={styles.headerSubtitle}>Let's crush it! 💪</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {exercises.map((exercise, index) => {
            const setsCompleted = setsDoneCount[index] || 0;
            const isComplete = setsCompleted === exercise.sets;
            const progress = (setsCompleted / exercise.sets) * 100;

            return (
              <View key={index} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseIcon}>
                    <Ionicons name="barbell-outline" size={28} color="#fff" />
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseDetails}>
                      {exercise.sets} sets × {exercise.reps} reps
                    </Text>
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { width: `${progress}%` }]} />
                  <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.completeButton,
                    isComplete && styles.completeButtonDisabled
                  ]}
                  onPress={() => handleCompleteSet(index)}
                  disabled={isComplete}
                >
                  <Text style={styles.buttonText}>
                    {isComplete ? 'Completed' : `Complete Set (${setsCompleted}/${exercise.sets})`}
                  </Text>
                </TouchableOpacity>

                {isResting && index === Object.keys(setsDoneCount).length - 1 && (
                  <View style={styles.restTimerContainer}>
                    <Ionicons name="timer-outline" size={24} color="#E74C3C" />
                    <Text style={styles.restTimer}>
                      Rest: {restTime}s
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#ECF0F1',
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  exerciseCard: {
    margin: 16,
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    backdropFilter: 'blur(10px)',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  exerciseIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  exerciseDetails: {
    fontSize: 16,
    color: '#ECF0F1',
    opacity: 0.8,
  },
  progressContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#E74C3C',
    borderRadius: 3,
  },
  progressText: {
    position: 'absolute',
    right: 0,
    top: -20,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#E74C3C',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#E74C3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  completeButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  restTimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  restTimer: {
    color: '#E74C3C',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default WorkoutSessionScreen; 