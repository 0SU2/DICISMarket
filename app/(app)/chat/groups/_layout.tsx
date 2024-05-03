import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { DrawerToggleButton } from '@react-navigation/drawer'

export default function LayoutGroupChats() {
  return (
    <Stack>
      <Stack.Screen 
        name='chats'
        options={{
          headerTitle: "Chat Groups",
          headerLeft: () => <DrawerToggleButton/>
        }}  
      />
      <Stack.Screen 
        name='[id]' 
        options={{
          headerTitle: "Chat"
        }}
      />
    </Stack>
  )
}