import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const HeaderStats = ({ userName = "User", streak = 5, stats = {}, photoURL }) => {
  // Example stats: { workouts: 12, calories: 3400 }
  return (
    <View style={styles.headerContainer}>
      <View style={styles.row}>
        {photoURL ? (
          <Image source={{ uri: photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <MaterialCommunityIcons name="account-circle" size={48} color="#B0B8C1" />
          </View>
        )}
        <View>
          <Text style={styles.welcome}>Welcome back{userName ? `, ${userName}!` : ','}</Text>
          {/* Optionally remove the separate userName line if the greeting is enough, or keep for emphasis */}
        </View>
      </View>
      <View style={styles.streakRow}>
        {[...Array(7)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.streakDot,
              i < streak ? styles.streakActive : styles.streakInactive,
            ]}
          />
        ))}
        <Text style={styles.streakText}>{streak}-day streak</Text>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.workouts || 0}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.calories || 0}</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>
        {/* Add more stats as needed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E5EA',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    backgroundColor: '#eee',
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 14,
    color: '#6C7580',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  streakActive: {
    backgroundColor: '#2075FF',
  },
  streakInactive: {
    backgroundColor: '#E2E5EA',
  },
  streakText: {
    marginLeft: 8,
    color: '#2075FF',
    fontWeight: '600',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B365D',
  },
  statLabel: {
    fontSize: 12,
    color: '#6C7580',
  },
});

export default HeaderStats; 