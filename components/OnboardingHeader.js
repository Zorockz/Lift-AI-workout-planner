import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

const OnboardingHeader = ({ title, onBack, onSkip, showSkip = true }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.leftIcon} hitSlop={{top: 8, left: 8, right: 8, bottom: 8}}>
        <Text style={styles.chevron}>{Platform.OS === 'ios' ? '‹' : '<'}</Text>
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      {showSkip ? (
        <TouchableOpacity onPress={onSkip} style={styles.rightSkip} hitSlop={{top: 8, left: 8, right: 8, bottom: 8}}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.rightSkip} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingTop: 24,
    paddingBottom: 0,
    height: 64,
    paddingHorizontal: 16,
  },
  leftIcon: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 0,
  },
  chevron: {
    color: '#1B365D',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 0,
  },
  title: {
    flex: 1,
    color: '#1B365D',
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '600' : '500',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  rightSkip: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 0,
  },
  skip: {
    color: '#2075FF',
    fontSize: 16,
    fontWeight: '400',
  },
});

export default OnboardingHeader; 