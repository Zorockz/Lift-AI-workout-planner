import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const cardioWorkouts = [
  { name: 'Running', duration: '30 min' },
  { name: 'Cycling', duration: '45 min' },
  { name: 'Jump Rope', duration: '20 min' },
  { name: 'Rowing', duration: '25 min' },
];

const CardioScreen = () => {
  const navigation = useNavigation();
  const [completed, setCompleted] = useState([]);

  const handleComplete = (name) => {
    setCompleted((prev) => prev.includes(name) ? prev : [...prev, name]);
  };

  return (
    <View style={styles.container}>
      {/* No custom header, use navigator's header */}
      <FlatList
        data={cardioWorkouts}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => {
          const isDone = completed.includes(item.name);
          return (
            <View style={[styles.workoutItem, isDone && styles.completedItem]}>
              <View>
                <Text style={[styles.workoutName, isDone && styles.completedText]}>{item.name}</Text>
                <Text style={[styles.workoutDuration, isDone && styles.completedText]}>{item.duration}</Text>
              </View>
              <TouchableOpacity
                style={[styles.completeButton, isDone && styles.completeButtonDone]}
                onPress={() => handleComplete(item.name)}
                disabled={isDone}
              >
                <MaterialCommunityIcons name={isDone ? 'check-circle' : 'checkbox-blank-circle-outline'} size={28} color={isDone ? '#2ECC71' : '#2075FF'} />
                <Text style={[styles.completeText, isDone && styles.completedText]}>{isDone ? 'Completed' : 'Mark Complete'}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 24,
  },
  workoutItem: {
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedItem: {
    backgroundColor: '#E8F5E9',
    opacity: 0.7,
  },
  workoutName: {
    fontSize: 16,
    color: '#1B365D',
    fontWeight: '600',
  },
  workoutDuration: {
    fontSize: 14,
    color: '#2075FF',
    fontWeight: '500',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2075FF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  completeButtonDone: {
    borderColor: '#2ECC71',
    backgroundColor: '#F0FFF4',
  },
  completeText: {
    marginLeft: 8,
    color: '#2075FF',
    fontWeight: '600',
    fontSize: 14,
  },
  completedText: {
    color: '#2ECC71',
    textDecorationLine: 'line-through',
  },
});

export default CardioScreen; 