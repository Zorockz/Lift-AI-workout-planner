import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');
const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 5;

const HeightWeightPicker = ({ type = 'height', value, onChange }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  // Validate props
  const validType = type === 'height' || type === 'weight' ? type : 'height';
  const validValue = value || (validType === 'height' ? 66 : 150); // Default values

  const generateHeightOptions = () => {
    const options = [];
    // Feet (4' to 7')
    for (let feet = 4; feet <= 7; feet++) {
      // Inches (0" to 11")
      for (let inches = 0; inches <= 11; inches++) {
        options.push({
          label: `${feet}'${inches}"`,
          value: feet * 12 + inches,
        });
      }
    }
    return options;
  };

  const generateWeightOptions = () => {
    const options = [];
    // Weight range from 80 to 300 pounds
    for (let weight = 80; weight <= 300; weight++) {
      options.push({
        label: `${weight} lbs`,
        value: weight,
      });
    }
    return options;
  };

  const options = validType === 'height' ? generateHeightOptions() : generateWeightOptions();
  const currentIndex = options.findIndex(option => option.value === validValue);

  useEffect(() => {
    if (scrollViewRef.current && currentIndex !== -1) {
      const offset = currentIndex * ITEM_HEIGHT;
      scrollViewRef.current.scrollTo({ y: offset, animated: true });
    }
  }, [currentIndex]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const handleMomentumScrollEnd = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    if (index >= 0 && index < options.length && typeof onChange === 'function') {
      onChange(options[index].value);
    }
  };

  const renderItem = (item, index) => {
    const inputRange = [
      (index - 2) * ITEM_HEIGHT,
      (index - 1) * ITEM_HEIGHT,
      index * ITEM_HEIGHT,
      (index + 1) * ITEM_HEIGHT,
      (index + 2) * ITEM_HEIGHT,
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.9, 0.95, 1.1, 0.95, 0.9],
      extrapolate: 'clamp',
    });

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0.7, 0.85, 1, 0.85, 0.7],
      extrapolate: 'clamp',
    });

    const isSelected = index === currentIndex;

    return (
      <Animated.View
        key={item.value}
        style={[
          styles.itemContainer,
          {
            transform: [{ scale }],
            opacity,
            backgroundColor: isSelected ? '#F0F7FF' : 'transparent',
          },
        ]}
      >
        <Text style={[
          styles.itemText,
          isSelected && styles.selectedItemText
        ]}>
          {item.label}
        </Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Animated.ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={true}
          scrollIndicatorInsets={{ right: 0 }}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          contentContainerStyle={styles.scrollContent}
        >
          {options.map((item, index) => renderItem(item, index))}
        </Animated.ScrollView>
        <View style={styles.mask} pointerEvents="none">
          <View style={styles.maskTop} />
          <View style={styles.maskMiddle} />
          <View style={styles.maskBottom} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: width * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#2075FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  scrollContent: {
    paddingVertical: ITEM_HEIGHT * 2,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginHorizontal: 8,
  },
  itemText: {
    fontSize: 28,
    color: '#1B365D',
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedItemText: {
    color: '#2075FF',
    fontWeight: '700',
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    pointerEvents: 'none',
  },
  maskTop: {
    flex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  maskMiddle: {
    height: ITEM_HEIGHT,
    backgroundColor: 'transparent',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#2075FF',
  },
  maskBottom: {
    flex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});

export default HeightWeightPicker; 