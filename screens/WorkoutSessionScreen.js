import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const WorkoutSessionScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { exercises, dayKey } = route.params;
  
  // State for tracking completed exercises
  const [completedExercises, setCompletedExercises] = useState({});
  
  // State for rest timer
  const [restTime, setRestTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  
  // State for workout session
  const [sessionStartTime] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);

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
    const currentSets = completedExercises[exerciseIndex] || 0;
    
    setCompletedExercises(prev => ({
      ...prev,
      [exerciseIndex]: currentSets + 1,
    }));

    if (currentSets + 1 < exercise.sets) {
      setRestTime(exercise.restTime || 60);
      setIsResting(true);
    }
  };

  // Handler for finishing the workout
  const handleFinishWorkout = async () => {
    setIsSaving(true);
    
    try {
      // Calculate session duration
      const sessionEndTime = new Date();
      const duration = Math.round((sessionEndTime - sessionStartTime) / 1000 / 60); // in minutes
      
      // Prepare workout log data
      const workoutLog = {
        date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        exercises: exercises.map((exercise, index) => ({
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight || 0, // Default to 0 if no weight specified
          completed: (completedExercises[index] || 0) === exercise.sets,
          setsCompleted: completedExercises[index] || 0,
          restTime: exercise.restTime || 60,
          notes: exercise.notes || '',
        })),
        duration: duration,
        dayKey: dayKey || 'Unknown',
        completedAt: new Date().toISOString(),
        isLocal: !user?.uid, // Flag to identify locally saved workouts
      };

      if (user?.uid) {
        // Save to Firestore if user is authenticated
        const logsRef = collection(db, 'users', user.uid, 'logs');
        await addDoc(logsRef, {
          ...workoutLog,
          userId: user.uid,
          completedAt: serverTimestamp(),
        });
      } else {
        // Save to AsyncStorage if user is not authenticated
        try {
          // Get existing logs
          const existingLogsStr = await AsyncStorage.getItem('localWorkoutLogs');
          const existingLogs = existingLogsStr ? JSON.parse(existingLogsStr) : [];
          
          // Add new log
          existingLogs.push(workoutLog);
          
          // Save back to AsyncStorage
          await AsyncStorage.setItem('localWorkoutLogs', JSON.stringify(existingLogs));
        } catch (storageError) {
          throw new Error('Failed to save workout locally');
        }
      }
      
      Alert.alert(
        'Workout Complete! 🎉',
        user?.uid
          ? 'Great job! Your workout has been saved.'
          : 'Workout saved locally!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
      
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to save your workout. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => setIsSaving(false),
          },
        ]
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate overall workout progress
  const totalSets = exercises.reduce((acc, exercise) => acc + exercise.sets, 0);
  const completedSets = Object.values(completedExercises).reduce((acc, sets) => acc + sets, 0);
  const overallProgress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  const isWorkoutComplete = completedSets === totalSets;

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#2C3E50', '#3498DB']}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Workout Session</Text>
            <Text style={styles.headerSubtitle}>
              {dayKey || 'Today\'s Workout'} • {Math.round(overallProgress)}% Complete
            </Text>
          </View>
        </View>

        {/* Overall Progress Bar */}
        <View style={styles.overallProgressContainer}>
          <View style={styles.overallProgressBar}>
            <View 
              style={[
                styles.overallProgressFill, 
                { width: `${overallProgress}%` },
              ]} 
            />
          </View>
          <Text style={styles.overallProgressText}>
            {completedSets}/{totalSets} sets completed
          </Text>
        </View>

        {/* Exercises List */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {exercises.map((exercise, index) => {
            const setsCompleted = completedExercises[index] || 0;
            const isComplete = setsCompleted === exercise.sets;
            const progress = exercise.sets > 0 ? (setsCompleted / exercise.sets) * 100 : 0;

            return (
              <View key={index} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseIcon}>
                    <Ionicons 
                      name={isComplete ? 'checkmark-circle' : 'barbell-outline'} 
                      size={28} 
                      color={isComplete ? '#2ECC71' : '#fff'} 
                    />
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseDetails}>
                      {/* Robust sets/reps/duration display, never NaN/undefined/0 unless truly zero */}
                      {(
                        Number.isFinite(Number(exercise.sets)) && Number(exercise.sets) > 0 &&
                        Number.isFinite(Number(exercise.reps)) && Number(exercise.reps) > 0
                      )
                        ? `${Number(exercise.sets)} sets × ${Number(exercise.reps)} reps`
                        : (Number.isFinite(Number(exercise.duration)) && Number(exercise.duration) > 0)
                          ? `${Number(exercise.duration)} min`
                          : ''}
                    </Text>
                    {exercise.notes && (
                      <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { width: `${progress}%` }]} />
                  <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.completeButton,
                    isComplete && styles.completeButtonDisabled,
                  ]}
                  onPress={() => handleCompleteSet(index)}
                  disabled={isComplete}
                >
                  <Text style={styles.buttonText}>
                    {isComplete
                      ? 'Completed'
                      : `Complete Set (${(setsCompleted ?? 0)}/${(Number.isFinite(Number(exercise.sets)) && Number(exercise.sets) > 0) ? Number(exercise.sets) : '-'})`}
                  </Text>
                </TouchableOpacity>

                {isResting && index === Object.keys(completedExercises).length - 1 && (
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

        {/* Finish Workout Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.finishButton,
              (!isWorkoutComplete || isSaving) && styles.finishButtonDisabled,
            ]}
            onPress={handleFinishWorkout}
            disabled={!isWorkoutComplete || isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.finishButtonText}>
                  {isWorkoutComplete ? 'Finish Workout' : `Complete ${totalSets - completedSets} more sets`}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ECF0F1',
    opacity: 0.8,
  },
  overallProgressContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  overallProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: '#2ECC71',
    borderRadius: 4,
  },
  overallProgressText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.9,
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
    marginBottom: 4,
  },
  exerciseNotes: {
    fontSize: 14,
    color: '#ECF0F1',
    opacity: 0.6,
    fontStyle: 'italic',
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
  footer: {
    padding: 20,
    paddingBottom: 30,
  },
  finishButton: {
    backgroundColor: '#2ECC71',
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2ECC71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  finishButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowOpacity: 0,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default WorkoutSessionScreen; 