import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 2000);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#4A90E2" />
      <Text style={{ marginTop: 20, fontSize: 18 }}>Loading...</Text>
    </View>
  );
}
