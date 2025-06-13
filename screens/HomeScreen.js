import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWorkout } from '../contexts/WorkoutContext';
import { useNavigation } from '@react-navigation/native';
import StreakBar from '../components/StreakBar';
import WeeklyBubbles from '../components/WeeklyBubbles';
import TodayCard from '../components/TodayCard';

// Header component definition
const Header = ({ onSettingsPress }) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection} />
      <Text style={styles.title}>FitnessPal</Text>
      <TouchableOpacity 
        onPress={onSettingsPress} 
        style={styles.rightSection}
        hitSlop={{top: 8, left: 8, right: 8, bottom: 8}}
      >
        <MaterialCommunityIcons name="cog" size={24} color="#1B365D" />
      </TouchableOpacity>
    </View>
  );
};

const DetailsPanel = ({ title, items, isExpanded, onToggle }) => {
  return (
    <View style={styles.detailsPanel}>
      <TouchableOpacity 
        style={styles.detailsHeader}
        onPress={onToggle}
      >
        <Text style={styles.detailsTitle}>{title}</Text>
        <MaterialCommunityIcons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#6C7580" 
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.detailsContent}>
          {items.map((item, index) => (
            <View key={index} style={styles.detailItem}>
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const WorkoutCard = ({ workout, onStartPress, loading }) => {
  const getWorkoutIcon = (title) => {
    const lowerTitle = title?.toLowerCase() || '';
    if (lowerTitle.includes('upper')) return 'arm-flex';
    if (lowerTitle.includes('lower')) return 'leg';
    if (lowerTitle.includes('core')) return 'abdominal';
    if (lowerTitle.includes('cardio')) return 'run';
    return 'dumbbell';
  };

  if (loading) {
    return (
      <View style={styles.workoutCard}>
        <View style={styles.workoutAccent} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2075FF" />
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.workoutCard}>
      <View style={styles.workoutAccent} />
      <MaterialCommunityIcons 
        name={getWorkoutIcon(workout?.title)} 
        size={24} 
        color="#2075FF" 
        style={styles.workoutIcon}
      />
      <Text style={styles.workoutHeader}>Today's Workout</Text>
      <Text style={styles.workoutTitle}>
        {workout?.title || 'No Workout Scheduled'}
      </Text>

      {workout?.isRestDay ? (
        <View style={styles.restDayContainer}>
          <MaterialCommunityIcons name="bed" size={24} color="#6C7580" />
          <Text style={styles.restDayText}>Rest Day</Text>
          <Text style={styles.restDaySubtext}>Recovery is crucial for progress</Text>
        </View>
      ) : (
        <View style={styles.exercisesList}>
          {workout?.exercises?.map((exercise, index) => (
            <View key={index} style={styles.exerciseItem}>
              <Text style={styles.exerciseNumber}>{index + 1}</Text>
              <Text style={styles.exerciseName}>{exercise}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity 
        style={[
          styles.startWorkoutButton,
          (!workout || workout.isRestDay) && styles.disabledButton
        ]} 
        onPress={onStartPress}
        disabled={!workout || workout.isRestDay}
      >
        <Text style={styles.startWorkoutText}>
          {!workout ? 'No Workout' : workout.isRestDay ? 'Rest Day' : '▶︎ Start Workout'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const { 
    getTodaysWorkout, 
    currentDay, 
    setCurrentDay,
    createWorkoutPlan,
    getExerciseInstructions,
    loading,
    error,
    currentStreak,
    bestStreak,
    weekData
  } = useWorkout();
  const todaysWorkout = getTodaysWorkout();
  const insets = useSafeAreaInsets();
  const [exerciseDetails, setExerciseDetails] = useState({});
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [screenHeight, setScreenHeight] = useState(0);

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setScreenHeight(height);
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleStartWorkout = () => {
    if (!todaysWorkout || todaysWorkout.isRestDay) return;
    navigation.navigate('WorkoutSession', { workout: todaysWorkout });
  };

  const handleExercisePress = async (exerciseName) => {
    try {
      if (!exerciseDetails[exerciseName]) {
        const details = await getExerciseInstructions(exerciseName);
        setExerciseDetails(prev => ({
          ...prev,
          [exerciseName]: details
        }));
      }
      navigation.navigate('ExerciseDetails', {
        exerciseName,
        details: exerciseDetails[exerciseName]
      });
    } catch (error) {
      console.error('Error loading exercise details:', error);
    }
  };

  const calculateWorkoutMetrics = () => {
    if (!todaysWorkout?.exercises) return { totalSets: 0, estimatedTime: 0 };
    
    const totalSets = todaysWorkout.exercises.reduce((sum, exercise) => {
      // Assuming each exercise has 3 sets by default
      return sum + 3;
    }, 0);

    // Assuming 2 minutes per set (including rest)
    const estimatedTime = totalSets * 2;

    return { totalSets, estimatedTime };
  };

  const handleRestTimerPress = () => {
    navigation.navigate('RestTimer', { duration: 60 }); // Default 60 seconds
  };

  const { totalSets, estimatedTime } = calculateWorkoutMetrics();

  const getWeeklyData = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - 6 + i);
      
      // This is mock data - replace with actual workout data
      const types = ['workout', 'rest', 'recovery', 'hiit'];
      const randomType = Math.random() > 0.3 ? types[Math.floor(Math.random() * types.length)] : null;
      
      days.push({
        type: randomType
      });
    }
    
    return days;
  };

  const handleBarPress = (day) => {
    // Navigate to the specific day's workout
    navigation.navigate('WorkoutDetails', { date: day.date });
  };

  const getWorkoutDetails = () => {
    // Sample workout data - replace with real data later
    const sampleWorkout = {
      exercises: [
        { name: 'Push-ups', sets: 3, reps: 12 },
        { name: 'Squats', sets: 4, reps: 15 },
        { name: 'Plank', sets: 3, reps: 60 },
        { name: 'Lunges', sets: 3, reps: 10 }
      ],
      primaryMuscles: ['Chest', 'Shoulders', 'Legs', 'Core'],
      equipment: ['None', 'Bodyweight'],
      estimatedDuration: 30
    };

    return [
      { 
        label: 'Total Exercises', 
        value: sampleWorkout.exercises.length 
      },
      { 
        label: 'Total Sets', 
        value: sampleWorkout.exercises.reduce((sum, e) => sum + e.sets, 0) 
      },
      { 
        label: 'Est. Duration', 
        value: `${sampleWorkout.estimatedDuration} min`
      },
      { 
        label: 'Primary Muscles', 
        value: sampleWorkout.primaryMuscles.join(', ') 
      },
      { 
        label: 'Equipment', 
        value: sampleWorkout.equipment.join(', ') 
      }
    ];
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']} onLayout={onLayout}>
      <Header onSettingsPress={handleSettingsPress} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={{paddingBottom: insets.bottom + 16}}>
        <View style={styles.streakContainer}>
          <StreakBar current={currentStreak} best={bestStreak} />
        </View>
        
        <View style={styles.section}>
          <WeeklyBubbles weekData={getWeeklyData()} />
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : todaysWorkout && !todaysWorkout.isRestDay ? (
          <TodayCard
            plan={{
              name: todaysWorkout.title,
              exercises: todaysWorkout.exercises.map(exercise => ({
                name: exercise,
                sets: 3,
                reps: 8,
                weight: 135
              }))
            }}
            onStart={handleStartWorkout}
          />
        ) : null}

        {/* Today's Workout Card */}
        <View style={[
          styles.workoutCardContainer,
          screenHeight > 0 && { minHeight: screenHeight * 0.4 }
        ]}>
          <WorkoutCard
            workout={todaysWorkout}
            onStartPress={handleStartWorkout}
            loading={loading}
          />
        </View>

        {/* Details Panel */}
        {!todaysWorkout?.isRestDay && (
          <DetailsPanel
            title="Workout Details"
            items={getWorkoutDetails()}
            isExpanded={isDetailsExpanded}
            onToggle={() => setIsDetailsExpanded(!isDetailsExpanded)}
          />
        )}

        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>3</Text>
              <Text style={styles.progressLabel}>Workouts Completed</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>12</Text>
              <Text style={styles.progressLabel}>Exercises Done</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>85%</Text>
              <Text style={styles.progressLabel}>Weekly Goal</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollView: {
    flex: 1,
  },
  streakContainer: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  streakText: {
    fontSize: 14,
    color: '#334155',
    fontFamily: 'System',
  },
  workoutCardContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  workoutCard: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 40,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
  },
  workoutAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#2075FF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  workoutIcon: {
    position: 'absolute',
    top: 24,
    right: 24,
  },
  workoutHeader: {
    fontSize: 40,
    fontWeight: '600',
    color: '#1B365D',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'System',
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#6C7580',
    textAlign: 'center',
    marginBottom: 40,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'System',
  },
  exercisesList: {
    marginBottom: 40,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E5EA',
  },
  exerciseNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1B365D',
    width: 32,
    marginRight: 16,
    fontFamily: 'System',
  },
  exerciseName: {
    flex: 1,
    fontSize: 20,
    fontWeight: '400',
    color: '#1B365D',
    fontFamily: 'System',
  },
  startWorkoutButton: {
    height: 64,
    backgroundColor: '#2075FF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    shadowColor: '#2075FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startWorkoutText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '600',
    fontFamily: 'System',
  },
  restDayContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    marginBottom: 32,
  },
  restDayText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#E65100',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'System',
  },
  restDaySubtext: {
    fontSize: 18,
    fontWeight: '400',
    color: '#6C7580',
    textAlign: 'center',
    fontFamily: 'System',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1B365D',
    marginBottom: 12,
    fontFamily: 'System',
  },
  progressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EFF1F5',
    borderRadius: 12,
    padding: 20,
    marginTop: 12,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: '500',
    color: '#2075FF',
    fontFamily: 'System',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6C7580',
    marginTop: 4,
    fontFamily: 'System',
  },
  errorContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
  },
  detailsPanel: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#EFF1F5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1B365D',
    fontFamily: 'System',
  },
  detailsContent: {
    padding: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E5EA',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6C7580',
    fontFamily: 'System',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1B365D',
    fontFamily: 'System',
  },
  bubblesContainer: {
    backgroundColor: '#EFF1F5',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  bubblesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1B365D',
    marginBottom: 12,
    fontFamily: 'System',
  },
  bubblesContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  bubbleContainer: {
    alignItems: 'center',
    gap: 4,
  },
  bubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  bubbleLabel: {
    fontSize: 10,
    fontWeight: '400',
    color: '#6C7580',
    fontFamily: 'System',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '400',
    color: '#6C7580',
    fontFamily: 'System',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#6C7580',
    fontFamily: 'System',
  },
  disabledButton: {
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  leftSection: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1B365D',
    fontFamily: 'System',
  },
  rightSection: {
    padding: 8,
  },
});

export default HomeScreen; 