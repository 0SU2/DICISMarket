import { View, StyleSheet, FlatList, Pressable } from 'react-native'
import * as React from 'react'
import { roomRef, usersRef } from '@/context/firebase/FirebaseConfig'
import { DocumentData, getDoc, getDocs, query, queryEqual, where } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'
import Spinner from 'react-native-loading-spinner-overlay'
import ChatItem from '@/context/ChatItem'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

export default function ProfileTab() {
  const [ users, setUsers ] = React.useState<Array<DocumentData>>([]);
  const [ loading, setLoading ] = React.useState(false);
  const { getCurrentUserUid } = useAuth();
  const userUid = getCurrentUserUid();

  React.useEffect(() => {
    const getUsers = async() => {
      setLoading(true);
      // fetch users
      // conseguir a los usuarios con los que solamente estoy hablando
      const obtainQueryRooms = query(roomRef, where('idUser1', '==', userUid));
      
      const querySnpashotRooms = await getDocs(obtainQueryRooms);
      
      let dataObtainRooms:(DocumentData) = [];
      querySnpashotRooms.forEach(doc => {
        dataObtainRooms.push({...doc.data()})
      })
      
      let dataUsers:(DocumentData) = [];
      for (const doc of dataObtainRooms) {
        const queryData = query(usersRef, where('userId', '==', doc.idUser2));
        const querySnapShot = await getDocs(queryData);
        querySnapShot.forEach(doc => {
          dataUsers.push({...doc.data()});
        })
      }

      setUsers(dataUsers)
      setLoading(false);
    } 
    // return unsuscribe;
    getUsers();
    
  }, [])



  return (
    <View style={styles.container}>
      <Spinner visible={loading}/>  

      <FlatList
        data={users}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => 
          <Pressable onPress={()=> router.push({pathname: '/(app)/home/groups/chatRoom', params: item})}>
            <ChatItem 
              item={item} 
              index={index}
            />
          </Pressable>
        }
      />

    {/* <Pressable style={styles.fab} onPress={() => {}}>
      <Ionicons name='add' size={24} color={"white"} />
    </Pressable> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 15,
    bottom: 20,
    backgroundColor: '#03a9f4',
    borderRadius: 30,
    elevation: 3,
  },
  groupCard: {
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 10,
    elevation: 4,
  }
});