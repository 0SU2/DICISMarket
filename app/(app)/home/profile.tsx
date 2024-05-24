import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { useAuth } from '@/context/AuthContext'
import { Feather, Fontisto } from '@expo/vector-icons';
import { Image } from 'expo-image';

export default function ProfileTab() {
  const { getCurrentUser, getCurrenUsername, getCurrentUserImage } = useAuth();
  const currentUser = getCurrentUser();
  const currentUsername = getCurrenUsername();
  const currentImage = getCurrentUserImage();
  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  
  return (
    <View style={styles.container}>
      
      <View style={styles.imageProfile}>
        <Image
          style={styles.image}
          source={currentImage}
          placeholder={{ blurhash }}
          contentFit='cover'
          contentPosition={'center'}
          transition={500}
        />
      </View>

      <Text style={styles.textoBienvenida}>Welcome {currentUsername} </Text>

      <View style={styles.buttonsTheme}>
        <TouchableOpacity onPress={() => alert("Night mode")} style={styles.buttonThemeSelected}>
          <Fontisto name="night-clear" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert("Light mode")} style={styles.buttonThemeSelected}>
          <Feather name="sun" size={24} color="black" />
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 200
  },
  textoBienvenida: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  imageProfile: {
    justifyContent: 'center'
  },
  image: {
    borderRadius: 85,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
  buttonsTheme: {
    flexDirection: 'row'
  },
  buttonThemeSelected: {
    padding: 10
  }
})