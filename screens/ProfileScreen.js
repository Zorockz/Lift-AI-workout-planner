import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useOnboarding } from '../OnboardingContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { onboarding } = useOnboarding();
  const { signOut, error, clearError, loading } = useAuth();

  // Show error alert when authentication error occurs
  useEffect(() => {
    if (error) {
      Alert.alert(
        'Authentication Error',
        error,
        [
          {
            text: 'OK',
            onPress: clearError
          }
        ]
      );
    }
  }, [error]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    {
      icon: 'account',
      title: 'Personal Information',
      subtitle: 'Update your profile details',
      onPress: () => navigation.navigate('PersonalInfo'),
    },
    {
      icon: 'dumbbell',
      title: 'Workout Preferences',
      subtitle: 'Modify your workout settings',
      onPress: () => navigation.navigate('WorkoutPreferences'),
    },
    {
      icon: 'chart-line',
      title: 'Progress Tracking',
      subtitle: 'View your fitness journey',
      onPress: () => console.log('Progress Tracking pressed'),
    },
    {
      icon: 'bell',
      title: 'Notifications',
      subtitle: 'Manage your alerts',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      icon: 'cog',
      title: 'Settings',
      subtitle: 'App preferences and more',
      onPress: () => console.log('Settings pressed'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1B365D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons name="account-circle" size={80} color="#1B365D" />
          </View>
          <Text style={styles.name}>FitBuddy User</Text>
          <Text style={styles.subtitle}>
            {onboarding.goal || 'Fitness Enthusiast'}
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{onboarding.weight || '--'}</Text>
            <Text style={styles.statLabel}>Current Weight</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{onboarding.goalWeight || '--'}</Text>
            <Text style={styles.statLabel}>Goal Weight</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{onboarding.experienceLevel || '--'}</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons name={item.icon} size={24} color="#1B365D" />
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#6C7580" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, loading && styles.disabledButton]}
          onPress={handleSignOut}
          disabled={loading}
        >
          <MaterialCommunityIcons name="logout" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>
            {loading ? 'Signing out...' : 'Log Out'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E5EA',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1B365D',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B365D',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C7580',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#F7F8FA',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B365D',
  },
  statLabel: {
    fontSize: 12,
    color: '#6C7580',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E5EA',
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E5EA',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: 16,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1B365D',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#6C7580',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 24,
    padding: 16,
    backgroundColor: '#FFF3F3',
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF3B30',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default ProfileScreen; 