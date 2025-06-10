import { StyleSheet } from 'react-native';

// Colors
export const colors = {
  primary: '#2075FF',
  secondary: '#1B365D',
  text: {
    primary: '#1B365D',
    secondary: '#6C7580',
    white: '#FFFFFF',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F7F8FA',
  },
  status: {
    success: '#2E7D32',
    error: '#C62828',
    successBg: '#E8F5E9',
    errorBg: '#FFEBEE',
  },
};

// Dimensions
export const dimensions = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
};

// Common styles
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    padding: dimensions.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: dimensions.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: dimensions.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: dimensions.fontSize.lg,
    color: colors.text.secondary,
    marginBottom: dimensions.spacing.xl,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginBottom: dimensions.spacing.xl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: dimensions.borderRadius.md,
    borderWidth: 2,
    marginBottom: dimensions.spacing.md,
    paddingLeft: dimensions.spacing.md,
    paddingRight: dimensions.spacing.md,
    justifyContent: 'space-between',
    position: 'relative',
  },
  cardUnselected: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.primary,
  },
  cardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    fontSize: dimensions.fontSize.lg,
    fontWeight: '500',
  },
  labelUnselected: {
    color: colors.text.primary,
  },
  labelSelected: {
    color: colors.text.white,
    fontWeight: 'bold',
  },
}); 