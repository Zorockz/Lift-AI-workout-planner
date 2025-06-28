import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useOnboarding } from '../contexts/OnboardingContext';
import HeaderStats from '../components/HeaderStats';
import WeeklyBubbles from '../components/WeeklyBubbles';
import TodayWorkoutCard from '../components/TodayWorkoutCard';
import UpcomingWorkoutCard from '../components/UpcomingWorkoutCard';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import AddExerciseModal from '../components/AddExerciseModal';
import { useWorkout } from '../contexts/WorkoutContext';
import Button from '../components/Button';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { onboarding } = useOnboarding();
  const [stats, setStats] = useState({ workouts: 0, calories: 0 });
  const [user, setUser] = useState({ name: 'User', streak: 1, photoURL: null });
  const [selectedBubble, setSelectedBubble] = useState('Strength');
  const [modalVisible, setModalVisible] = useState(false);
  const { workoutPlan, addExercise, currentDay, setWorkoutPlan } = useWorkout();

  useEffect(() => {
    // Get user photoURL from Firebase Auth if available
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(prev => ({ ...prev, name: currentUser.displayName || prev.name, photoURL: currentUser.photoURL || null }));
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (workoutPlan && workoutPlan.weekPlan) {
      let workouts = 0, calories = 0;
      Object.values(workoutPlan.weekPlan).forEach(day => {
        if (day.type === 'workout') {
          workouts++;
          calories += 100; // Placeholder
        }
      });
      setStats({ workouts, calories });
    }
  }, [workoutPlan]);

  // Find today's and next workout from context
  const todayKey = workoutPlan && workoutPlan.weekPlan && Object.keys(workoutPlan.weekPlan)[currentDay - 1];
  let todayWorkout = workoutPlan && workoutPlan.weekPlan && workoutPlan.weekPlan[todayKey] && workoutPlan.weekPlan[todayKey].type === 'workout'
    ? workoutPlan.weekPlan[todayKey]
    : null;
  // If today is a rest day, show the next workout day
  if (!todayWorkout && workoutPlan && workoutPlan.weekPlan) {
    const nextWorkoutDay = Object.values(workoutPlan.weekPlan).find(day => day && day.type === 'workout');
    if (nextWorkoutDay) {
      todayWorkout = nextWorkoutDay;
    } else {
      // If all days are rest days, fallback to first day
      todayWorkout = workoutPlan.weekPlan[Object.keys(workoutPlan.weekPlan)[0]];
    }
  }
  const nextWorkout = workoutPlan && workoutPlan.weekPlan && Object.values(workoutPlan.weekPlan).find(day => day && day.type === 'workout' && day !== todayWorkout);

  const handleStartWorkout = () => {
    if (todayWorkout) {
      navigation.navigate('WorkoutSession', {
        exercises: todayWorkout.exercises,
        dayKey: todayKey,
      });
    }
  };

  const handleSeeFullPlan = () => {
    if (workoutPlan && workoutPlan.weekPlan) {
      navigation.navigate('FullPlan', { plan: { weekPlan: workoutPlan.weekPlan } });
    }
  };

  // Handle bubble navigation
  const handleBubbleSelect = (bubble) => {
    setSelectedBubble(bubble);
    if (bubble === 'Cardio') {
      navigation.navigate('CardioScreen');
    } else if (bubble === 'Flexibility') {
      navigation.navigate('FlexibilityScreen');
    }
  };

  // Add useFocusEffect to update name from navigation params or localStorage
  useFocusEffect(
    React.useCallback(() => {
      // Try to get updated name from navigation params
      if (navigation && navigation.getState) {
        const routes = navigation.getState().routes;
        const profileRoute = routes && routes.find(r => r.name === 'Profile');
        if (profileRoute && profileRoute.params && profileRoute.params.name) {
          setUser(prev => ({ ...prev, name: profileRoute.params.name }));
        } else {
          // Try to get from localStorage (if you want to persist across reloads)
          const savedName = window && window.localStorage ? window.localStorage.getItem('userName') : null;
          if (savedName) setUser(prev => ({ ...prev, name: savedName }));
        }
      }
    }, [navigation])
  );

  const handleGenerateTodayWorkout = async () => {
    if (onboarding && Object.keys(onboarding).length > 0 && workoutPlan && workoutPlan.weekPlan) {
      try {
        const { generateSingleWorkout } = await import('../utils/planGenerator');
        // Generate a single workout day for today
        const generatedWorkout = await generateSingleWorkout({
          goal: onboarding.goal,
          experience: onboarding.experienceLevel,
          equipment: onboarding.equipment,
          location: onboarding.exerciseLocation,
        });
        // Replace only today's exercises and notes in the weekPlan
        const todayKey = Object.keys(workoutPlan.weekPlan)[currentDay - 1];
        const newWeekPlan = { ...workoutPlan.weekPlan };
        newWeekPlan[todayKey] = {
          ...newWeekPlan[todayKey],
          exercises: generatedWorkout.exercises || [],
          notes: generatedWorkout.notes || '',
          type: 'workout', // Always ensure it's a workout day
        };
        setWorkoutPlan({ ...workoutPlan, weekPlan: newWeekPlan });
      } catch (error) {
        // Handle workout generation error silently or show user-friendly message
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <HeaderStats userName={user.name} streak={user.streak} photoURL={user.photoURL} />
        <WeeklyBubbles selected={selectedBubble} onSelect={handleBubbleSelect} />
        <TodayWorkoutCard
          exercises={todayWorkout && todayWorkout.exercises ? todayWorkout.exercises : []}
          onStart={handleStartWorkout}
          isRestDay={todayWorkout && todayWorkout.type === 'rest'}
          restDayNotes={todayWorkout && todayWorkout.type === 'rest' ? todayWorkout.notes : ''}
          onGenerateWorkout={handleGenerateTodayWorkout}
          renderFooter={() => (
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
              <Button
                title="+ Add Exercise"
                onPress={() => setModalVisible(true)}
              />
              <Button
                title={<View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="reload-circle" size={22} color="#66bb6a" style={{ marginRight: 6 }} />
                  <Text style={{ color: '#388e3c', fontWeight: 'bold' }}>Generate New Workout</Text>
                </View>}
                onPress={handleGenerateTodayWorkout}
                style={{ backgroundColor: '#e8f5e9', borderWidth: 1, borderColor: '#66bb6a', minWidth: 0, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 20 }}
                textStyle={{ color: '#388e3c', fontWeight: 'bold' }}
              />
            </View>
          )}
        />
        <UpcomingWorkoutCard
          date={nextWorkout ? nextWorkout.date : ''}
          exercises={nextWorkout && nextWorkout.exercises ? nextWorkout.exercises : []}
          onSeeFullPlan={handleSeeFullPlan}
        />
      </ScrollView>
      <AddExerciseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={(exercise) => {
          addExercise(currentDay - 1, exercise);
          setModalVisible(false);
        }}
      />
      {/* Footer Navigation */}
      <View style={styles.footerNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.iconButton}>
          <Ionicons name="person-outline" size={28} color="#B0B8C1" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={[styles.homeIconWrapper, styles.iconButton]}>
          <Ionicons name="home" size={38} color="#2075FF" style={styles.homeIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollContent: {
    paddingBottom: 100, // Make room for footer
  },
  footerNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 72,
    borderTopWidth: 1,
    borderTopColor: '#E2E5EA',
    backgroundColor: '#fff',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 12,
  },
  homeIconWrapper: { marginHorizontal: 12 },
  homeIcon: { width: 38, height: 38 },
  iconButton: { alignItems: 'center', justifyContent: 'flex-end', flex: 1, paddingBottom: 8 },
});

export default HomeScreen; 