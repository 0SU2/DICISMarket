import { View, StyleSheet } from 'react-native'
import * as React from 'react'
import { usersRef } from '@/context/firebase/FirebaseConfig'
import { DocumentData, getDocs, query, where } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'
import Spinner from 'react-native-loading-spinner-overlay'
import ChatList from '@/context/ChatList'

export default function ProfileTab() {
  const [ users, setUsers ] = React.useState<DocumentData>([]);
  const [ loading, setLoading ] = React.useState(false);
  const { getCurrentUserUid } = useAuth();
  const userUid = getCurrentUserUid();

  React.useEffect(() => {
    // return unsuscribe;
    if(userUid) {
      getUsers();
    }
  }, [])

  
  const getUsers = async() => {
    setLoading(true);
    // fetch users
    const obtainQuery = query(usersRef, where('userId', '!=', userUid));
    const querySnapshot = await getDocs(obtainQuery);
    let dataObtain:(DocumentData) = [];
    querySnapshot.forEach(doc => {
      dataObtain.push({...doc.data()})
    })
    setUsers(dataObtain);
    setLoading(false);
  } 

  return (
    <View style={styles.container}>
      <Spinner visible={loading}/>  
      <ChatList users={users} />
      {/* {groups.map((groups) => (
        <Link key={groups.id} href={`/(app)/chat/groups/${groups.id}`} asChild>
          <TouchableOpacity style={styles.groupCard}>
            <Text>{groups.name}</Text>
            <Text>{groups.description}</Text>
          </TouchableOpacity>
        </Link>
      ))} */}

    {/* <Pressable style={styles.fab} onPress={startGroup}>
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