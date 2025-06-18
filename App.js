import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { WorkoutProvider } from './contexts/WorkoutContext';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { testFirebaseAuth } from './utils/testAuth';
import React from 'react';

// Onboarding Screens
import WelcomeScreen from './screens/onboarding/WelcomeScreen';
import GenderSelectionScreen from './screens/onboarding/GenderSelectionScreen';
import GoalSelectionScreen from './screens/onboarding/GoalSelectionScreen';
import ExperienceLevelScreen from './screens/onboarding/ExperienceLevelScreen';
import StrengthTrainingHistoryScreen from './screens/onboarding/StrengthTrainingHistoryScreen';
import EquipmentInputScreen from './screens/onboarding/EquipmentInputScreen';
import ScheduleInputScreen from './screens/onboarding/ScheduleInputScreen';
import OnboardingSummary from './screens/onboarding/OnboardingSummary';
import PlanGenerationScreen from './screens/onboarding/PlanGenerationScreen';
import PlanPreviewScreen from './screens/onboarding/PlanPreviewScreen';
import ExerciseLocationScreen from './screens/onboarding/ExerciseLocationScreen';
import TargetMusclesScreen from './screens/onboarding/TargetMusclesScreen';
import HeightInputScreen from './screens/onboarding/HeightInputScreen';
import WeightInputScreen from './screens/onboarding/WeightInputScreen';
import GoalWeightInputScreen from './screens/onboarding/GoalWeightInputScreen';

// Main App Screens
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import FullPlanScreen from './screens/FullPlanScreen';
import WorkoutSessionScreen from './screens/WorkoutSessionScreen';

const Stack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

// Onboarding navigator
const OnboardingNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="GenderSelection" component={GenderSelectionScreen} />
    <Stack.Screen name="GoalSelection" component={GoalSelectionScreen} />
    <Stack.Screen name="ExperienceLevel" component={ExperienceLevelScreen} />
    <Stack.Screen name="StrengthTrainingHistory" component={StrengthTrainingHistoryScreen} />
    <Stack.Screen name="EquipmentInput" component={EquipmentInputScreen} />
    <Stack.Screen name="ScheduleInput" component={ScheduleInputScreen} />
    <Stack.Screen name="OnboardingSummary" component={OnboardingSummary} />
    <Stack.Screen name="PlanGeneration" component={PlanGenerationScreen} />
    <Stack.Screen name="PlanPreview" component={PlanPreviewScreen} />
    <Stack.Screen name="ExerciseLocation" component={ExerciseLocationScreen} />
    <Stack.Screen name="TargetMuscles" component={TargetMusclesScreen} />
    <Stack.Screen name="HeightInput" component={HeightInputScreen} />
    <Stack.Screen name="WeightInput" component={WeightInputScreen} />
    <Stack.Screen name="GoalWeightInput" component={GoalWeightInputScreen} />
  </Stack.Navigator>
);

// Main app navigator
const MainNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="FullPlan" component={FullPlanScreen} />
    <Stack.Screen 
      name="WorkoutSession" 
      component={WorkoutSessionScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

function AppNavigator() {
  const { isOnboardingComplete, loading, user, isGuest } = useAuth();

  if (loading) {
    console.log('AppNavigator: Loading state, showing spinner');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Determine which navigator to show
  const shouldShowOnboarding = !isOnboardingComplete;
  
  console.log('AppNavigator - Auth state:', {
    user: user ? 'Signed in' : 'Not signed in',
    isGuest,
    isOnboardingComplete,
    shouldShowOnboarding,
    loading
  });

  // Additional safeguard: if user is not signed in and not guest, show onboarding
  if (!user && !isGuest && !isOnboardingComplete) {
    console.log('AppNavigator: User not signed in, showing onboarding');
    return (
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen 
          name="Onboarding" 
          component={OnboardingNavigator}
          options={{ gestureEnabled: false }}
        />
      </RootStack.Navigator>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {shouldShowOnboarding ? (
        <RootStack.Screen 
          name="Onboarding" 
          component={OnboardingNavigator}
          options={{ gestureEnabled: false }}
        />
      ) : (
        <RootStack.Screen 
          name="Main" 
          component={MainNavigator}
          options={{ gestureEnabled: false }}
        />
      )}
    </RootStack.Navigator>
  );
}

export default function App() {
  // Test Firebase auth initialization
  React.useEffect(() => {
    testFirebaseAuth();
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthProvider>
            <OnboardingProvider>
              <WorkoutProvider>
                <StatusBar style="auto" />
                <AppNavigator />
              </WorkoutProvider>
            </OnboardingProvider>
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
} 