import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { generatePlan } from '../utils/planGenerator';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useOnboarding } from '../contexts/OnboardingContext';

const quickAccess = [
  { label: 'Strength', icon: 'barbell-outline' },
  { label: 'Cardio', icon: 'bicycle-outline' },
  { label: 'Flexibility', icon: 'yoga' },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const { onboarding } = useOnboarding();
  const [plan, setPlan] = useState(null);
  const [stats, setStats] = useState({ activeDays: 0, workouts: 0, time: 0, calories: 0 });
  const [user, setUser] = useState({ name: 'User', streak: 1, avatar: null });
  const [generatedPlan, setGeneratedPlan] = useState(null);

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
      let activeDays = 0, workouts = 0, time = 0, calories = 0;
      Object.values(generatedPlan.weekPlan).forEach(day => {
        if (day.type === 'workout') {
          activeDays++;
          workouts++;
          time += day.exercises.reduce((acc, ex) => acc + (ex.duration || 30), 0);
          calories += 100; // Placeholder
        }
      });
      setStats({ activeDays, workouts, time, calories });
    }
  }, [generatedPlan]);

  // Find next workout
  const nextWorkout = plan && Object.values(plan).find(day => day && day.type === 'workout');

  const handleNavigation = (screenName, params = {}) => {
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate(screenName, params);
    }
  };

  const handleSeeFullPlan = () => {
    if (plan && navigation && typeof navigation.navigate === 'function') {
      navigation.navigate('FullPlan', { plan: { weekPlan: plan } });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={28} color="#fff" />
            </View>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcome}>Welcome back, {user.name}</Text>
          <Text style={styles.streak}>You have a {user.streak} week streak going.</Text>
        </View>
        <MaterialCommunityIcons name="calendar-week" size={28} color="#2075FF" />
      </View>

      {/* Streak Days */}
      <View style={styles.streakRow}>
        {[...Array(7)].map((_, i) => (
          <View key={i} style={[styles.streakDot, i === 2 && styles.streakDotActive]} />
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsTabs}>
        <View style={styles.statsTab}><Text style={styles.statsLabel}>Active days</Text><Text style={styles.statsValue}>{stats.activeDays}</Text></View>
        <View style={styles.statsTab}><Text style={styles.statsLabel}>Workouts</Text><Text style={styles.statsValue}>{stats.workouts}</Text></View>
        <View style={styles.statsTab}><Text style={styles.statsLabel}>Time</Text><Text style={styles.statsValue}>{stats.time}m</Text></View>
        <View style={styles.statsTab}><Text style={styles.statsLabel}>Calories</Text><Text style={styles.statsValue}>{stats.calories}</Text></View>
      </View>

      {/* Quick Access */}
      <View style={styles.quickAccessRow}>
        {quickAccess.map((item, idx) => (
          <TouchableOpacity key={item.label} style={styles.quickAccessTile}>
            <MaterialCommunityIcons name={item.icon} size={28} color="#2075FF" />
            <Text style={styles.quickAccessLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upcoming Workout */}
      <View style={styles.upcomingCard}>
        <View style={styles.upcomingHeader}>
          <Text style={styles.upcomingTitle}>Upcoming Workout</Text>
          {plan && (
            <TouchableOpacity 
              style={styles.seeFullPlanButton}
              onPress={handleSeeFullPlan}
            >
              <Text style={styles.seeFullPlanText}>See Full Plan</Text>
            </TouchableOpacity>
          )}
        </View>
        {nextWorkout ? (
          <View style={styles.workoutDetails}>
            <Text style={styles.workoutDate}>{nextWorkout.date || 'Today'}</Text>
            {nextWorkout.exercises && Array.isArray(nextWorkout.exercises) && nextWorkout.exercises.map((ex, i) => (
              <Text key={i} style={styles.workoutExercise}>
                {ex.name} - {ex.sets ? `${ex.sets}x${ex.reps}` : ex.duration ? `${ex.duration} min` : ''}
              </Text>
            ))}
            <Text style={styles.workoutNotes}>{nextWorkout.notes || 'Focus on form and consistency'}</Text>
            
            {/* Start Workout Button */}
            <TouchableOpacity 
              style={styles.startWorkoutButton}
              onPress={() => {
                // Find the day key for this workout
                const dayKey = Object.keys(plan).find(key => plan[key] === nextWorkout) || 'Day 1';
                handleNavigation('WorkoutSession', {
                  exercises: nextWorkout.exercises,
                  dayKey: dayKey
                });
              }}
            >
              <Ionicons name="play" size={20} color="#fff" />
              <Text style={styles.startWorkoutText}>Start Workout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noWorkout}>No upcoming workout.</Text>
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => handleNavigation('Profile')} style={styles.iconButton}>
          <Ionicons name="person-outline" size={28} color="#B0B8C1" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation('Home')} style={[styles.homeIconWrapper, styles.iconButton]}>
          <Ionicons name="home" size={38} color="#2075FF" style={styles.homeIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation('Progress')} style={styles.iconButton}>
          <Ionicons name="analytics-outline" size={28} color="#B0B8C1" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 48 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 8 },
  avatarWrapper: { marginRight: 16 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  avatarPlaceholder: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#2075FF', alignItems: 'center', justifyContent: 'center' },
  welcome: { fontSize: 16, color: '#1B365D', fontWeight: '600' },
  streak: { fontSize: 14, color: '#6C7580' },
  streakRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 8 },
  streakDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#E2E5EA', marginHorizontal: 4 },
  streakDotActive: { backgroundColor: '#2075FF' },
  statsTabs: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 24, marginVertical: 12 },
  statsTab: { alignItems: 'center', flex: 1 },
  statsLabel: { fontSize: 12, color: '#6C7580' },
  statsValue: { fontSize: 18, color: '#1B365D', fontWeight: 'bold' },
  quickAccessRow: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 12, marginVertical: 16 },
  quickAccessTile: { alignItems: 'center', backgroundColor: '#F7F8FA', borderRadius: 12, padding: 16, flex: 1, marginHorizontal: 4 },
  quickAccessLabel: { marginTop: 8, color: '#2075FF', fontWeight: '600' },
  upcomingCard: { backgroundColor: '#F7F8FA', borderRadius: 16, margin: 24, padding: 20, shadowColor: '#2075FF22', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  upcomingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  upcomingTitle: { fontSize: 16, color: '#1B365D', fontWeight: 'bold' },
  seeFullPlanButton: { padding: 8, borderWidth: 1, borderColor: '#2075FF', borderRadius: 8 },
  seeFullPlanText: { color: '#2075FF', fontWeight: '600' },
  workoutDetails: { marginTop: 4 },
  workoutDate: { color: '#2075FF', fontWeight: '600', marginBottom: 4 },
  workoutExercise: { color: '#1B365D', fontSize: 14, marginBottom: 2 },
  workoutNotes: { color: '#6C7580', fontSize: 12, marginTop: 6 },
  noWorkout: { color: '#B0B8C1', fontSize: 14 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 72, borderTopWidth: 1, borderTopColor: '#E2E5EA', backgroundColor: '#fff', position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: 12 },
  homeIconWrapper: { marginHorizontal: 12 },
  homeIcon: { width: 38, height: 38 },
  iconButton: { alignItems: 'center', justifyContent: 'flex-end', flex: 1, paddingBottom: 8 },
  startWorkoutButton: { 
    backgroundColor: '#2075FF',
    padding: 12, 
    borderRadius: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 16,
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
});

export default HomeScreen; 