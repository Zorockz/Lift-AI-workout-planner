import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const HeaderStats = ({ userName = 'User', streak = 5, stats = {}, photoURL }) => {
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
      {/* New Streak Counter UI */}
      <View style={styles.streakCounterContainer}>
        <Text style={styles.streakCounterText}>
          {streak} Day Streak <Text style={styles.fireEmoji}>🔥</Text>
        </Text>
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
  streakCounterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  streakCounterText: {
    fontSize: 14,
    color: '#6C7580',
    fontWeight: '600',
  },
  fireEmoji: {
    fontSize: 16,
    color: '#FFA500',
    marginLeft: 4,
  },
});

export default HeaderStats; 