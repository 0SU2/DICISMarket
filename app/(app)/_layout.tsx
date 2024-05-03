import { View, Text, Button, StyleSheet, useColorScheme } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '@/context/AuthContext';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';

export default function LayoutApp() {
  const colorScheme = useColorScheme();
  const { signOut } = useAuth();
  return (
    <Drawer>
      <Drawer.Screen name="profile" options={{ title: "Home" }}/>
      <Drawer.Screen name="chat" options={{ title: "Chat", headerShown: false }}/>
    </Drawer>
  )
}

// dont delete yet
// <Ionicons name="return-down-back-sharp" size={24} color={colorScheme === "dark" ? "black" : "white"} onPress={() => alert("yes")} style={[themeColorButtonIcon]}/>

    // <Tabs screenOptions={{ tabBarActiveTintColor: "#54b9ff" }}>
    //   <Tabs.Screen 
    //     name='groups' 
    //     options={{
    //       tabBarIcon: ({color, size}) => <Ionicons name='chatbubbles' size={size} color={color}/>,
    //       headerShown: false,
    //       tabBarLabel: 'Chats',
    //       headerTitle: 'Chats Groups',
    //     }}
    //   />
    //   <Tabs.Screen 
    //     name='profile'
    //     options={{
    //       tabBarIcon: ({color, size}) => <Ionicons name='person' size={size} color={color}/>,
    //       headerTitle: 'Profile',
    //       tabBarLabel: 'Profile',
    //       headerRight: () => <Button title='Logout' onPress={signOut}></Button>,
    //     }}
    //   />
    // </Tabs>