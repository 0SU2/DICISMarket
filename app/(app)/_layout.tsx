import { View, Text, Button, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native'
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
      <Drawer.Screen 
        name="profile" 
        options={{ 
          title: "Home", 
          headerRight: () => (
            <TouchableOpacity style={styles.buttonLogout} onPress={signOut}>
              <Ionicons name="exit-outline" size={20} color="black" />
            </TouchableOpacity>
          )
        }}
      />
      <Drawer.Screen name="chat" options={{ title: "Chat", headerShown: false }}/>
    </Drawer>
  )
}

const styles = StyleSheet.create({
  buttonLogout: {
    backgroundColor: '#f35656', 
    alignItems: 'center', 
    justifyContent: 'center' ,
    width: 30, 
    height: 30,
    borderRadius: 10, 
    margin: 10 
  }
})

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