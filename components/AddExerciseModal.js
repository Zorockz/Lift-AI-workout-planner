import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';

const AddExerciseModal = ({ visible, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  const resetFields = () => {
    setName('');
    setSets('');
    setReps('');
  };

  const handleAdd = () => {
    if (!name.trim() || !sets || !reps) {
      Alert.alert('Please fill in all fields.');
      return;
    }
    if (isNaN(sets) || isNaN(reps) || sets <= 0 || reps <= 0) {
      Alert.alert('Sets and reps must be positive numbers.');
      return;
    }
    let finalSets = Number(sets);
    let finalReps = Number(reps);
    if (name.toLowerCase().includes('cardio') || finalReps === 1) {
      finalSets = 1;
      finalReps = 1;
    }
    onAdd({
      name: name.trim(),
      sets: finalSets,
      reps: finalReps,
    });
    resetFields();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Add Custom Exercise</Text>
          <TextInput
            style={styles.input}
            placeholder="Exercise Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Sets"
            value={sets}
            onChangeText={setSets}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Reps"
            value={reps}
            onChangeText={setReps}
            keyboardType="numeric"
          />
          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={() => { resetFields(); onClose(); }} />
            <Button title="Add" onPress={handleAdd} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
});

export default AddExerciseModal; 