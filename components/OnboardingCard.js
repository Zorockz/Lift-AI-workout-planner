import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const OnboardingCard = ({ label, description, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected ? styles.selectedContainer : styles.unselectedContainer]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.label, isSelected ? styles.selectedLabel : styles.unselectedLabel]}>{label}</Text>
        {description ? (
          <Text style={[styles.description, isSelected ? styles.selectedDescription : styles.unselectedDescription]}>{description}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 56,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  unselectedContainer: {
    backgroundColor: '#F7F8FA',
    borderColor: '#2075FF',
  },
  selectedContainer: {
    backgroundColor: '#2075FF',
    borderColor: '#2075FF',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 16,
    width: '100%',
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
  },
  unselectedLabel: {
    color: '#1B365D',
  },
  selectedLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginTop: 2,
  },
  unselectedDescription: {
    color: '#6C7580',
    fontWeight: '400',
  },
  selectedDescription: {
    color: '#FFFFFF',
    fontWeight: '400',
  },
});

export default OnboardingCard; 