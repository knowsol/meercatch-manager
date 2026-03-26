import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';

import SplashScreen from '../screens/SplashScreen';
import ModeSelectScreen from '../screens/ModeSelectScreen';
import PolicySetupScreen from '../screens/simple/PolicySetupScreen';
import SchoolSelectScreen from '../screens/manager/SchoolSelectScreen';
import GradeSelectScreen from '../screens/manager/GradeSelectScreen';
import ClassSelectScreen from '../screens/manager/ClassSelectScreen';
import StudentInfoScreen from '../screens/manager/StudentInfoScreen';
import HomeScreen from '../screens/HomeScreen';
import DetectionListScreen from '../screens/DetectionListScreen';
import DetectionDetailScreen from '../screens/DetectionDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { state } = useApp();

  if (state.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={state.deviceToken ? 'Home' : 'Splash'}
        screenOptions={{ headerShown: false }}
      >
        {/* Onboarding */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen
          name="ModeSelect"
          component={ModeSelectScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="PolicySetup" component={PolicySetupScreen} />
        <Stack.Screen name="SchoolSelect" component={SchoolSelectScreen} />
        <Stack.Screen name="GradeSelect" component={GradeSelectScreen} />
        <Stack.Screen name="ClassSelect" component={ClassSelectScreen} />
        <Stack.Screen name="StudentInfo" component={StudentInfoScreen} />

        {/* Main */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="DetectionList"
          component={DetectionListScreen}
          options={{ headerShown: true, title: '탐지 기록', headerBackTitle: '뒤로' }}
        />
        <Stack.Screen
          name="DetectionDetail"
          component={DetectionDetailScreen}
          options={{ headerShown: true, title: '탐지 상세', headerBackTitle: '뒤로' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: true, title: '설정', headerBackTitle: '뒤로' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },
});
