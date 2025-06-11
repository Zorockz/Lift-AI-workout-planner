import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ExerciseDetails = ({ route }) => {
  const { exerciseName, details } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{exerciseName}</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {!details ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2075FF" />
            <Text style={styles.loadingText}>Loading exercise details...</Text>
          </View>
        ) : (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>{details}</Text>
          </View>
        )}
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B365D',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6C7580',
  },
  detailsContainer: {
    padding: 16,
  },
  detailsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1B365D',
  },
});

export default ExerciseDetails; 