import { View, Text, Platform, KeyboardAvoidingView, ScrollView } from 'react-native'
import React from 'react'

export default function CustomKeyboardView({children}:React.PropsWithChildren) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding': 'height'} style={{ flex: 10 }}>
      <ScrollView 
        style={{ flex: 1, }}
        bounces={false}
        showsVerticalScrollIndicator={false} 
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}