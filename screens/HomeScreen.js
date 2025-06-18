import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { generatePlan } from '../utils/planGenerator';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const quickAccess = [
  { label: 'Strength', icon: 'barbell-outline' },
  { label: 'Cardio', icon: 'bicycle-outline' },
  { label: 'Flexibility', icon: 'yoga' },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [plan, setPlan] = useState(null);
  const [stats, setStats] = useState({ activeDays: 0, workouts: 0, time: 0, calories: 0 });
  const [user, setUser] = useState({ name: 'User', streak: 1, avatar: null });

  useEffect(() => {
    // Simulate fetching user and plan data
    async function fetchData() {
      // Replace with real user/profile data as needed
      setUser({ name: 'JudySmithh', streak: 1, avatar: null });
      const generated = await generatePlan({ daysPerWeek: 3, experience: 'beginner', goal: 'strength', equipment: [] });
      setPlan(generated.weekPlan);
      // Calculate stats from plan (example logic)
      let activeDays = 0, workouts = 0, time = 0, calories = 0;
      Object.values(generated.weekPlan).forEach(day => {
        if (day.type === 'workout') {
          activeDays++;
          workouts++;
          time += day.exercises.reduce((acc, ex) => acc + (ex.duration || 30), 0);
          calories += 100; // Placeholder
        }
      });
      setStats({ activeDays, workouts, time, calories });
    }
    fetchData();
  }, []);

  // Find next workout
  const nextWorkout = plan && Object.values(plan).find(day => day.type === 'workout');

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
        <Text style={styles.upcomingTitle}>Upcoming Workout</Text>
        {nextWorkout ? (
          <View style={styles.workoutDetails}>
            <Text style={styles.workoutDate}>{nextWorkout.date}</Text>
            {nextWorkout.exercises && nextWorkout.exercises.map((ex, i) => (
              <Text key={i} style={styles.workoutExercise}>{ex.name} - {ex.sets ? `${ex.sets}x${ex.reps}` : ex.duration ? `${ex.duration} min` : ''}</Text>
            ))}
            <Text style={styles.workoutNotes}>{nextWorkout.notes}</Text>
          </View>
        ) : (
          <Text style={styles.noWorkout}>No upcoming workout.</Text>
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.iconButton}>
          <Ionicons name="person-outline" size={28} color="#B0B8C1" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={[styles.homeIconWrapper, styles.iconButton]}>
          <Ionicons name="home" size={38} color="#2075FF" style={styles.homeIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Progress')} style={styles.iconButton}>
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
  upcomingTitle: { fontSize: 16, color: '#1B365D', fontWeight: 'bold', marginBottom: 8 },
  workoutDetails: { marginTop: 4 },
  workoutDate: { color: '#2075FF', fontWeight: '600', marginBottom: 4 },
  workoutExercise: { color: '#1B365D', fontSize: 14, marginBottom: 2 },
  workoutNotes: { color: '#6C7580', fontSize: 12, marginTop: 6 },
  noWorkout: { color: '#B0B8C1', fontSize: 14 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 72, borderTopWidth: 1, borderTopColor: '#E2E5EA', backgroundColor: '#fff', position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: 12 },
  homeIconWrapper: { marginHorizontal: 12 },
  homeIcon: { width: 38, height: 38 },
  iconButton: { alignItems: 'center', justifyContent: 'flex-end', flex: 1, paddingBottom: 8 },
});

export default HomeScreen; 