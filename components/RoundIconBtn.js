import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../misc/Colors';

const RoundIconBtn = ({ antIconName, size, color, style, onPress }) => {
  return (
    <MaterialIcons
      name={antIconName}
      size={size || 24}
      color={color || Colors.LIGHT}
      style={[styles.icon, { ...style }]}
      onPress={onPress}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    backgroundColor: Colors.BUTTON,
    padding: 8,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
});

export default RoundIconBtn;
