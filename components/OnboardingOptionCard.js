import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const OnboardingOptionCard = ({ 
  title, 
  description, 
  icon, 
  isSelected, 
  onSelect,
  iconColor = '#2075FF',
  iconBackground = '#E3F2FD',
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, isSelected && styles.selectedContainer]} 
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <BlurView intensity={isSelected ? 20 : 10} style={styles.blurContainer}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: iconBackground }]}>
            <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, isSelected && styles.selectedTitle]}>
              {title}
            </Text>
            {description && (
              <Text style={[styles.description, isSelected && styles.selectedDescription]}>
                {description}
              </Text>
            )}
          </View>
          {isSelected && (
            <View style={styles.checkmarkContainer}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#2075FF" />
            </View>
          )}
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E5EA',
  },
  selectedContainer: {
    borderColor: '#2075FF',
    borderWidth: 2,
  },
  blurContainer: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B365D',
    marginBottom: 4,
  },
  selectedTitle: {
    color: '#2075FF',
  },
  description: {
    fontSize: 14,
    color: '#6C7580',
    lineHeight: 20,
  },
  selectedDescription: {
    color: '#2075FF',
  },
  checkmarkContainer: {
    marginLeft: 12,
  },
});

export default OnboardingOptionCard; 