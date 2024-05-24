import { View, Text, Button, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '@/context/AuthContext';
import { Drawer } from 'expo-router/drawer';
import { AntDesign } from '@expo/vector-icons';

export default function LayoutApp() {
  const colorScheme = useColorScheme();
  const { signOut } = useAuth();
  return (
    <Stack>
      <Stack.Screen 
        name="home" 
        options={{ 
          title: "MarketDicis", 
          headerRight: () => (
            <TouchableOpacity style={styles.buttonLogout} onPress={signOut}>
              <Ionicons name="exit-outline" size={20} color="black" />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity style={{ padding: 10 }}>
              <AntDesign name="shoppingcart" size={24} color="black" />
            </TouchableOpacity>
          )

        }}
      />
    </Stack>
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