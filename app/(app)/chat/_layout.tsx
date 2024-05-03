import { View, Text } from 'react-native'
import React from 'react'
import { Drawer } from 'expo-router/drawer'
import { Tabs } from 'expo-router'

export default function LayoutApp() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name='groups'/>
    </Tabs>
  )
}