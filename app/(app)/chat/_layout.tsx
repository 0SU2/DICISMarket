import { View, Text } from 'react-native'
import React from 'react'
import { Drawer } from 'expo-router/drawer'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function LayoutApp() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen 
        name='groups'
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble" size={24} color={color} />
        }}
      />
    </Tabs>
  )
}