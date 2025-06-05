import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import GoalSelectionScreen from './screens/GoalSelectionScreen';
import StrengthTrainingHistoryScreen from './screens/StrengthTrainingHistoryScreen';
import ExperienceLevelScreen from './screens/ExperienceLevelScreen';
import ScheduleInputScreen from './screens/ScheduleInputScreen';
import EquipmentInputScreen from './screens/EquipmentInputScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="GoalSelection" component={GoalSelectionScreen} />
          <Stack.Screen name="StrengthTrainingHistory" component={StrengthTrainingHistoryScreen} />
          <Stack.Screen name="ExperienceLevel" component={ExperienceLevelScreen} />
          <Stack.Screen name="ScheduleInput" component={ScheduleInputScreen} />
          <Stack.Screen name="EquipmentInput" component={EquipmentInputScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 