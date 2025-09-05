import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { API_KEY } from "@env";
console.log("API_KEY:", API_KEY);

import Navigation from './src/navigation/navigation';
export default function App() {
  return (
    <Navigation />
  );
}