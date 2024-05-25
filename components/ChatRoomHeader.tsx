import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack, router } from 'expo-router'
import { Image } from 'expo-image'
import { Octicons } from '@expo/vector-icons';

export default function ChatRoomHeader({user}:{user:object}) {
  
  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <Stack.Screen 
      options={{
        title: '',
        headerShadowVisible: false,
        headerLeft: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity style={{ padding: 10 }} onPress={() => router.back()}>
              <Octicons name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <View style={{ alignItems: 'center'}}>
              <Image
                source={user?.profileUrl}
                placeholder={{ blurhash }}
                style={styles.image}
                contentPosition={'center'}
                contentFit='cover'
                transition={500}
              />
            </View>
            <Text style={styles.textChatUsername}>{user?.username}</Text>
          </View>
        ),
      }}
    />
  )
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 85,
    height: 35,
    width: 35,
    margin: 5,
    marginLeft: 20
  },
  textChatUsername: {
    fontSize: 20,
    marginLeft: 12,
    fontWeight: '500',
  }
})