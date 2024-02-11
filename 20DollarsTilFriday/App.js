import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { EventListScreen } from './screens/EventListScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="EventList" component={EventListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
