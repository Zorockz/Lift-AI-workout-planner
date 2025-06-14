import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { OnboardingProvider } from './OnboardingContext';
import { WorkoutProvider } from './contexts/WorkoutContext';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Onboarding Screens (now in subfolder)
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

const RootStack = createNativeStackNavigator();
const OnboardingStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

const OnboardingNavigator = () => (
  <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
    <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
    <OnboardingStack.Screen name="GenderSelection" component={GenderSelectionScreen} />
    <OnboardingStack.Screen name="GoalSelection" component={GoalSelectionScreen} />
    <OnboardingStack.Screen name="ExperienceLevel" component={ExperienceLevelScreen} />
    <OnboardingStack.Screen name="StrengthTrainingHistory" component={StrengthTrainingHistoryScreen} />
    <OnboardingStack.Screen name="EquipmentInput" component={EquipmentInputScreen} />
    <OnboardingStack.Screen name="ScheduleInput" component={ScheduleInputScreen} />
    <OnboardingStack.Screen name="ExerciseLocation" component={ExerciseLocationScreen} />
    <OnboardingStack.Screen name="TargetMuscles" component={TargetMusclesScreen} />
    <OnboardingStack.Screen name="HeightInput" component={HeightInputScreen} />
    <OnboardingStack.Screen name="WeightInput" component={WeightInputScreen} />
    <OnboardingStack.Screen name="GoalWeightInput" component={GoalWeightInputScreen} />
    <OnboardingStack.Screen name="OnboardingSummary" component={OnboardingSummary} />
    <OnboardingStack.Screen name="PlanGeneration" component={PlanGenerationScreen} />
    <OnboardingStack.Screen name="PlanPreview" component={PlanPreviewScreen} />
  </OnboardingStack.Navigator>
);

const MainNavigator = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name="Home" component={HomeScreen} />
    <MainStack.Screen name="Profile" component={ProfileScreen} />
    <MainStack.Screen name="FullPlan" component={FullPlanScreen} />
  </MainStack.Navigator>
);

function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name="Main" component={MainNavigator} />
      ) : (
        <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
      )}
    </RootStack.Navigator>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <OnboardingProvider>
          <WorkoutProvider>
            <AuthProvider>
              <NavigationContainer>
                <StatusBar style="auto" />
                <Navigation />
              </NavigationContainer>
            </AuthProvider>
          </WorkoutProvider>
        </OnboardingProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
} 