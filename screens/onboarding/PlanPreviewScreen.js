import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOnboarding } from '../../OnboardingContext';
import OnboardingHeader from '../../components/OnboardingHeader';
import { commonStyles, colors, dimensions } from '../../utils/styles';

const PlanPreviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { plan } = route.params || {};
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const { completeOnboarding } = useOnboarding();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const renderExercise = (exercise, index) => {
    if (exercise === "Rest Day") {
      return (
        <View key={index} style={styles.restDayContainer}>
          <Text style={styles.restDayText}>Rest Day</Text>
          <Text style={styles.restDaySubtext}>Recovery is crucial for progress</Text>
        </View>
      );
    }
    return (
      <View key={index} style={styles.exerciseContainer}>
        <View style={styles.exerciseHeader}>
          <Text style={[
            styles.exerciseType,
            exercise.type === "Warm-up" ? styles.warmupType : styles.mainType
          ]}>
            {exercise.type}
          </Text>
          <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
        </View>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        {exercise.type === "Main" && (
          <View style={styles.exerciseDetails}>
            <Text style={styles.exerciseDetail}>
              {exercise.sets} sets × {exercise.reps} reps
            </Text>
            <Text style={styles.exerciseDetail}>
              Rest: {exercise.rest} seconds
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderDayCard = (day, exercises, index) => {
    const isLocked = index >= 2;
    const cardContent = (
      <View style={styles.dayCard}>
        <Text style={styles.dayTitle}>{day}</Text>
        {Array.isArray(exercises)
          ? exercises.map((exercise, index) => renderExercise(exercise, index))
          : renderExercise(exercises, 0)
        }
      </View>
    );

    if (isLocked) {
      return (
        <View key={day} style={styles.lockedCardContainer}>
          <View style={styles.dayCard}>
            <BlurView intensity={20} style={StyleSheet.absoluteFillObject} />
            <View style={styles.dayCardContent}>
              <Text style={[styles.dayTitle, styles.lockedText]}>{day}</Text>
              {Array.isArray(exercises)
                ? exercises.map((exercise, index) => (
                    <View key={index} style={styles.lockedExercise}>
                      <Text style={styles.lockedText}>
                        {exercise.type === "Rest Day" ? "Rest Day" : exercise.name}
                      </Text>
                    </View>
                  ))
                : (
                    <View style={styles.lockedExercise}>
                      <Text style={styles.lockedText}>Rest Day</Text>
                    </View>
                  )
              }
            </View>
          </View>
          <View style={styles.lockIconContainer}>
            <MaterialCommunityIcons name="lock" size={24} color="#1B365D" />
          </View>
        </View>
      );
    }

    return <View key={day}>{cardContent}</View>;
  };

  const handleFinish = async () => {
    try {
      await completeOnboarding();
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      });
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Your Custom Plan</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {plan?.weekPlan ? (
          <>
            {Object.entries(plan.weekPlan).map(([day, exercises], index) => 
              renderDayCard(day, exercises, index)
            )}
            <TouchableOpacity 
              style={styles.seeFullPlanButton}
              onPress={() => navigation.navigate('FullPlan', { plan })}
            >
              <Text style={styles.seeFullPlanText}>See Full Plan</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.planText}>No plan data.</Text>
        )}
      </ScrollView>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleFinish}
      >
        <Text style={styles.buttonText}>Finish</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E5EA',
    paddingTop: 24,
  },
  title: {
    color: '#1B365D',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  planText: {
    fontSize: 18,
    color: '#1B365D',
    textAlign: 'center',
  },
  button: {
    margin: 24,
    backgroundColor: '#2075FF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dayCard: {
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#2075FF22',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  dayCardContent: {
    position: 'relative',
    zIndex: 1,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2075FF',
    marginBottom: 16,
  },
  exerciseContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E5EA',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseType: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  warmupType: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
  },
  mainType: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
  },
  exerciseDuration: {
    fontSize: 14,
    color: '#6C7580',
  },
  exerciseName: {
    fontSize: 16,
    color: '#1B365D',
    fontWeight: '600',
    marginBottom: 8,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#6C7580',
  },
  lockedCardContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  lockIconContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  seeFullPlanButton: {
    backgroundColor: '#F7F8FA',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  seeFullPlanText: {
    color: '#2075FF',
    fontSize: 16,
    fontWeight: '600',
  },
  restDayContainer: {
    backgroundColor: '#F7F8FA',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  restDayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B365D',
    marginBottom: 4,
  },
  restDaySubtext: {
    fontSize: 14,
    color: '#6C7580',
  },
  lockedText: {
    color: '#1B365D',
    opacity: 0.7,
  },
  lockedExercise: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
});

export default PlanPreviewScreen; 