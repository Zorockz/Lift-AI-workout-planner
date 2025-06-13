import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StreakBar = ({ current, best }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        🔥 {current}-Day Streak • Best: {best}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFF1F5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: '#334155',
    fontFamily: 'System',
  },
});

export default StreakBar; 