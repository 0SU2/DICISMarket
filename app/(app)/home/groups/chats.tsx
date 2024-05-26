import { View, StyleSheet, FlatList, Pressable } from 'react-native'
import * as React from 'react'
import { roomRef, usersRef } from '@/context/firebase/FirebaseConfig'
import { DocumentData, getDoc, getDocs, onSnapshot, or, query, queryEqual, where } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'
import Spinner from 'react-native-loading-spinner-overlay'
import ChatItem from '@/context/ChatItem'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

export default function ProfileTab() {
  const [ users, setUsers ] = React.useState<Array<DocumentData>>([]);
  const [ loading, setLoading ] = React.useState(false);
  const { getCurrentUserUid } = useAuth();

  React.useEffect(() => {
    setLoading(true)
    const usersMessages = query(usersRef, where("userId", "!=" , getCurrentUserUid()));
    let unsub = onSnapshot(usersMessages, (snapshot) => {
      let allMessages = snapshot.docs.map(doc => {
        return {...doc.data()}
      })
      setUsers(allMessages);
    })
    setLoading(false);
    return unsub;
    
  }, [])


  return (
    <View style={styles.container}>
      <Spinner visible={loading}/>  

      <FlatList
        data={users}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => 
          <Pressable onHoverIn={() => console.log('hover')
          } onPress={()=> router.push({pathname: '/(app)/home/groups/chatRoom', params: item})}>
            <ChatItem 
              item={item} 
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