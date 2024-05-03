import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { useAuth } from '@/context/AuthContext'

export default function ProfileTab() {
  const {getCurrentUser } =useAuth();
  const currentUser = getCurrentUser();
  
  return (
    <View>
      <Text>Welcome {currentUser} </Text>
    </View>
  )
}