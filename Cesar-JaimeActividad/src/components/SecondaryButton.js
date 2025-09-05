import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SecondaryButton = ({ onPress, text }) => {
  return (
    <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onPress}>
      <Text style={[styles.buttonText, styles.secondaryButtonText]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default SecondaryButton;

const styles = StyleSheet.create({
  button: {
    marginTop: 12,
    alignItems: 'center',
    borderRadius: 50,
    paddingVertical: 15,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#00796b',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  secondaryButtonText: {
    color: '#00796b',
  },
});
