import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, Switch } from 'react-native';
import StackNavigator from './navigation/StackNavigator';

export default function App() {

  const styles = StyleSheet.create({
    text: {
      fontSize: 50
    }
  });

  return (
    <>
    <StackNavigator />
    </>
  );
}