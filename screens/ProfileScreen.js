import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Image, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, signOut, error, clearError, loading } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(true);

  // Local state for profile info
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [photo, setPhoto] = useState(null);

  // Load workouts (both cloud and local)
  useEffect(() => {
    const loadWorkouts = async () => {
      setIsLoadingWorkouts(true);
      try {
        let allWorkouts = [];

        // Load local workouts
        const localLogsStr = await AsyncStorage.getItem('localWorkoutLogs');
        if (localLogsStr) {
          const localLogs = JSON.parse(localLogsStr);
          allWorkouts = [...allWorkouts, ...localLogs.map(log => ({ ...log, source: 'local' }))];
        }

        // Load cloud workouts if user is authenticated
        if (user?.uid) {
          const logsRef = collection(db, 'users', user.uid, 'logs');
          const q = query(logsRef, orderBy('completedAt', 'desc'), limit(50));
          const querySnapshot = await getDocs(q);
          const cloudWorkouts = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            source: 'cloud',
          }));
          allWorkouts = [...allWorkouts, ...cloudWorkouts];
        }

        // Sort all workouts by date
        allWorkouts.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
        setWorkouts(allWorkouts);
      } catch (error) {
        // Remove all console.error statements for production
      } finally {
        setIsLoadingWorkouts(false);
      }
    };

    loadWorkouts();
  }, [user]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Render a single workout item
  const WorkoutItem = ({ workout }) => (
    <View style={styles.workoutItem}>
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutDate}>{formatDate(workout.completedAt)}</Text>
        <View style={styles.workoutBadge}>
          <MaterialCommunityIcons 
            name={workout.source === 'cloud' ? 'cloud' : 'phone'} 
            size={14} 
            color={workout.source === 'cloud' ? '#2075FF' : '#4CAF50'} 
          />
          <Text style={[
            styles.workoutBadgeText,
            { color: workout.source === 'cloud' ? '#2075FF' : '#4CAF50' },
          ]}>
            {workout.source === 'cloud' ? 'Cloud' : 'Local'}
          </Text>
        </View>
      </View>
      <Text style={styles.workoutTitle}>{workout.dayKey}</Text>
      <View style={styles.workoutStats}>
        <View style={styles.workoutStat}>
          <MaterialCommunityIcons name="dumbbell" size={16} color="#666" />
          <Text style={styles.workoutStatText}>
            {workout.exercises.length} exercises
          </Text>
        </View>
        <View style={styles.workoutStat}>
          <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
          <Text style={styles.workoutStatText}>
            {workout.duration} min
          </Text>
        </View>
      </View>
    </View>
  );

  useEffect(() => {
    if (error) {
      Alert.alert(
        'Authentication Error',
        error,
        [
          {
            text: 'OK',
            onPress: clearError,
          },
        ]
      );
    }
  }, [error]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      // Remove all console.error statements for production
    }
  };

  const handleSupport = () => {
    Alert.alert(
      'Support',
      'Contact us at support@fitpal.com',
      [{ text: 'OK' }]
    );
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    // Update navigation params so HomeScreen can pick up the new name
    if (navigation && navigation.setParams) {
      navigation.setParams({ name });
    }
    // Also navigate to HomeScreen with the new name
    if (navigation && navigation.navigate) {
      navigation.navigate('Home', { name });
    }
    // Optionally store in localStorage for reload persistence (web only)
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('userName', name);
    }
    Alert.alert('Profile Saved', 'Your information has been updated.');
  };

  const handleViewPastWorkouts = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('PastWorkouts');
    }
  };

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
        {/* Profile Header - Editable */}
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handlePickImage}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.avatarImg} />
            ) : (
              <MaterialCommunityIcons name="account-circle" size={80} color="#1B365D" />
            )}
            <Text style={styles.editPhotoText}>Edit Photo</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            maxLength={3}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Workout History Section */}
        <View style={styles.workoutHistory}>
          <TouchableOpacity style={styles.pastWorkoutsButton} onPress={handleViewPastWorkouts}>
            <MaterialCommunityIcons name="history" size={20} color="#2075FF" />
            <Text style={styles.pastWorkoutsButtonText}>View Past Workouts</Text>
          </TouchableOpacity>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, loading && styles.disabledButton]}
          onPress={handleSignOut}
          disabled={loading}
        >
          <Text style={styles.logoutText}>
            {loading ? 'Signing out...' : 'Log Out'}
          </Text>
        </TouchableOpacity>

        {/* Support Button */}
        <TouchableOpacity 
          style={styles.supportButton}
          onPress={handleSupport}
        >
          <Text style={styles.supportText}>Support</Text>
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
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: '#F7F8FA',
    marginHorizontal: 16,
  },
  avatarContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  avatarImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 4,
  },
  editPhotoText: {
    color: '#2075FF',
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    width: 200,
    height: 40,
    borderColor: '#E2E5EA',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#1B365D',
  },
  saveButton: {
    backgroundColor: '#2075FF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  workoutHistory: {
    padding: 16,
  },
  workoutItem: {
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutDate: {
    fontSize: 14,
    color: '#666',
  },
  workoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  workoutBadgeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B365D',
    marginBottom: 8,
  },
  workoutStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  workoutStatText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  logoutButton: {
    height: 48,
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#2075FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  supportButton: {
    height: 48,
    marginHorizontal: 16,
    marginVertical: 0,
    marginBottom: 24,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2075FF',
  },
  disabledButton: {
    opacity: 0.7,
  },
  pastWorkoutsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F7FF',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 12,
  },
  pastWorkoutsButtonText: {
    color: '#2075FF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen; 