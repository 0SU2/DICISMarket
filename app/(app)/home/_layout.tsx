import React from 'react'
import { Tabs } from 'expo-router'
import { Octicons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

export default function LayoutIndex () {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: 'blue',
    }}>
      <Tabs.Screen
        name='posts'
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({color}) =>
            <FontAwesome5 name="home" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name='groups'
        options={{
          title: 'Chats',
          headerShown: false,
          tabBarIcon: ({color}) => 
            <Ionicons name="chatbubble" size={24} color={color} />
        }}
      />
      <Tabs.Screen 
        name='profile'
        options={{
          title: "Pefil",
          headerShown: false,
          tabBarIcon: ({color}) =>
            <Octicons name="person-fill" size={24} color={color} />
        }}
      />
    </Tabs>
  )
}
