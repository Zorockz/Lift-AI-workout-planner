import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWorkout } from '../contexts/WorkoutContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { getTodaysWorkout, currentDay, setCurrentDay } = useWorkout();
  const todaysWorkout = getTodaysWorkout();
  const insets = useSafeAreaInsets();

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleWorkoutPress = () => {
    navigation.navigate('PlanPreview');
  };

  const handleStartWorkout = () => {
    navigation.navigate('PlanPreview'); // Or a dedicated workout screen if available
  };

  const handleViewFullPlan = () => {
    navigation.navigate('PlanPreview');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FitBuddy</Text>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          <MaterialCommunityIcons name="account-circle" size={24} color="#1B365D" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{paddingBottom: insets.bottom + 16}}>
        {/* Today's Workout Card */}
        <TouchableOpacity style={styles.workoutCard} onPress={handleWorkoutPress}>
          <Text style={styles.workoutTitle}>
            {todaysWorkout?.day || 'Day 1'}: {todaysWorkout?.title || 'Loading...'}
          </Text>
          {todaysWorkout?.isRestDay ? (
            <Text style={styles.restDayText}>Rest Day - Recovery is crucial for progress</Text>
          ) : (
            <View style={styles.exercisesList}>
              {todaysWorkout?.exercises?.slice(0, 3).map((exercise, index) => (
                <Text key={index} style={styles.exerciseText}>
                  {exercise}
                </Text>
              ))}
              {todaysWorkout?.exercises?.length > 3 && (
                <Text style={styles.moreExercisesText}>
                  +{todaysWorkout.exercises.length - 3} more exercises
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>

        {/* Quick Actions Row (Prompt 2) */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.startWorkoutButton} onPress={handleStartWorkout}>
            <Text style={styles.startWorkoutText}>Start Workout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewPlanButton} onPress={handleViewFullPlan}>
            <Text style={styles.viewPlanText}>View Full Plan</Text>
          </TouchableOpacity>
        </View>

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

        {/* Quick Actions (old) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialCommunityIcons name="calendar" size={24} color="#1B365D" />
              <Text style={styles.actionText}>View Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialCommunityIcons name="chart-line" size={24} color="#1B365D" />
              <Text style={styles.actionText}>Progress</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialCommunityIcons name="cog" size={24} color="#1B365D" />
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 24,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    paddingHorizontal: 16,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1B365D',
  },
  profileButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  workoutCard: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E5EA',
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B365D',
    marginBottom: 12,
  },
  exercisesList: {
    gap: 8,
  },
  exerciseText: {
    fontSize: 16,
    color: '#6C7580',
  },
  restDayText: {
    fontSize: 16,
    color: '#6C7580',
    fontStyle: 'italic',
  },
  moreExercisesText: {
    fontSize: 14,
    color: '#2075FF',
    marginTop: 4,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 0,
  },
  startWorkoutButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#2075FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  startWorkoutText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewPlanButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1B365D',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    backgroundColor: '#FFF',
  },
  viewPlanText: {
    color: '#1B365D',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B365D',
    marginBottom: 12,
  },
  progressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F7F8FA',
    borderRadius: 8,
    padding: 16,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2075FF',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6C7580',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#1B365D',
    marginTop: 8,
  },
});

export default HomeScreen; 