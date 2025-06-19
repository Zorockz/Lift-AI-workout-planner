import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useOnboarding } from '../contexts/OnboardingContext';
import HeaderStats from '../components/HeaderStats';
import WeeklyBubbles from '../components/WeeklyBubbles';
import TodayWorkoutCard from '../components/TodayWorkoutCard';
import UpcomingWorkoutCard from '../components/UpcomingWorkoutCard';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { onboarding } = useOnboarding();
  const [plan, setPlan] = useState(null);
  const [stats, setStats] = useState({ workouts: 0, calories: 0 });
  const [user, setUser] = useState({ name: 'User', streak: 1, photoURL: null });
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [selectedBubble, setSelectedBubble] = useState('Strength');

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
    const generatePlanFromOnboarding = async () => {
      if (onboarding && Object.keys(onboarding).length > 0) {
        try {
          const { generatePlan } = await import('../utils/planGenerator');
          const generated = await generatePlan({
            goal: onboarding.goal,
            experience: onboarding.experienceLevel,
            equipment: onboarding.equipment,
            daysPerWeek: onboarding.workoutsPerWeek,
            location: onboarding.exerciseLocation,
          });
          setGeneratedPlan(generated);
        } catch (error) {
          console.error('Error generating plan from onboarding data:', error);
        }
      } else if (onboarding.generatedPlan) {
        setGeneratedPlan(onboarding.generatedPlan);
      } else {
        // Fallback to a basic plan if no onboarding data
        const fallbackPlan = {
          weekPlan: {
            "Day 1": {
              date: new Date().toISOString().split('T')[0],
              type: "workout",
              exercises: [
                { name: "Push-ups", sets: 3, reps: 10, restTime: 60, equipment: "bodyweight", notes: "Focus on form" },
                { name: "Bodyweight Squats", sets: 3, reps: 12, restTime: 60, equipment: "bodyweight", notes: "Keep back straight" },
                { name: "Plank", sets: 3, reps: 30, restTime: 45, equipment: "bodyweight", notes: "Hold position" }
              ],
              notes: "Basic workout to get started"
            }
          },
          metadata: {
            experience: "beginner",
            goal: "strength",
            daysPerWeek: 1,
            equipment: ["bodyweight"],
            location: "home",
            generatedAt: new Date().toISOString()
          }
        };
        setGeneratedPlan(fallbackPlan);
      }
    };
    generatePlanFromOnboarding();
  }, [onboarding]);

  useEffect(() => {
    if (generatedPlan) {
      setPlan(generatedPlan.weekPlan);
      let workouts = 0, calories = 0;
      Object.values(generatedPlan.weekPlan).forEach(day => {
        if (day.type === 'workout') {
          workouts++;
          calories += 100; // Placeholder
        }
      });
      setStats({ workouts, calories });
    }
  }, [generatedPlan]);

  // Find today's and next workout
  const todayKey = plan && Object.keys(plan)[0];
  const todayWorkout = plan && plan[todayKey] && plan[todayKey].type === 'workout' ? plan[todayKey] : null;
  const nextWorkout = plan && Object.values(plan).find(day => day && day.type === 'workout' && day !== todayWorkout);

  const handleStartWorkout = () => {
    if (todayWorkout) {
      navigation.navigate('WorkoutSession', {
        exercises: todayWorkout.exercises,
        dayKey: todayKey
      });
    }
  };

  const handleSeeFullPlan = () => {
    if (plan) {
      navigation.navigate('FullPlan', { plan: { weekPlan: plan } });
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <HeaderStats userName={user.name} streak={user.streak} stats={stats} photoURL={user.photoURL} />
        <WeeklyBubbles selected={selectedBubble} onSelect={handleBubbleSelect} />
        <TodayWorkoutCard exercises={todayWorkout ? todayWorkout.exercises : []} onStart={handleStartWorkout} />
        <UpcomingWorkoutCard
          date={nextWorkout ? nextWorkout.date : ''}
          exercises={nextWorkout ? nextWorkout.exercises : []}
          onSeeFullPlan={handleSeeFullPlan}
        />
      </ScrollView>
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