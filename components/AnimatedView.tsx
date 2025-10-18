import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface AnimatedViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
  type?: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale';
}

export default function AnimatedView({ 
  children, 
  delay = 0, 
  duration = 300,
  style,
  type = 'fade'
}: AnimatedViewProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  const getAnimationStyle = () => {
    switch (type) {
      case 'fade':
        return {
          opacity: animatedValue,
        };
      
      case 'slideUp':
        return {
          opacity: animatedValue,
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        };
      
      case 'slideDown':
        return {
          opacity: animatedValue,
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0],
            }),
          }],
        };
      
      case 'slideLeft':
        return {
          opacity: animatedValue,
          transform: [{
            translateX: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        };
      
      case 'slideRight':
        return {
          opacity: animatedValue,
          transform: [{
            translateX: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0],
            }),
          }],
        };
      
      case 'scale':
        return {
          opacity: animatedValue,
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          }],
        };
      
      default:
        return { opacity: animatedValue };
    }
  };

  return (
    <Animated.View style={[style, getAnimationStyle()]}>
      {children}
    </Animated.View>
  );
}
