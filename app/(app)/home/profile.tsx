import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, Pressable } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { useAuth } from '@/context/AuthContext'
import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { DocumentData, collection, getDoc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { FIRESTORE_DB, publicacionesRef } from '@/context/firebase/FirebaseConfig';
import MyOwnPosts from '@/components/OwnPosts';

export default function ProfileTab() {
  const { getCurrentUser, getCurrenUsername, getCurrentUserImage, getCurrentUserUid } = useAuth();
  const currentUsername = getCurrenUsername();
  const currentImage = getCurrentUserImage();
  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const [ publicaciones, setPublicaciones ] = React.useState<DocumentData[]>([]);

  React.useEffect(() =>{
    const postsQuery = query(collection(FIRESTORE_DB, "publicacion"), where("uidUser", "==", getCurrentUserUid()));
    let unsub = onSnapshot(postsQuery, (snapshot) => {
      let allPost = snapshot.docs.map(doc => {
        return {...doc.data(), id: doc.id}
      })
      setPublicaciones([...allPost]);
    });
    return unsub
  }, [])
  
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

      <Text style={styles.textoBienvenida}>Bienvenido {currentUsername} </Text>
      <Text style={styles.textoTituloPublicaciones}>Tus publicaciones: </Text>
      <FlatList
        data={publicaciones}
        renderItem={({item}) => <MyOwnPosts item={item} />}
        keyExtractor={(item) => item.id}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20
  },
  textoBienvenida: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  textoTituloPublicaciones: {
    fontSize: 20,
    paddingVertical: 10,
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
  },
})