import { View, Pressable, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { FIRESTORE_DB } from '@/context/firebase/FirebaseConfig'
import { DocumentData, addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'
import Spinner from 'react-native-loading-spinner-overlay'

export default function ProfileTab() {
  const [ groupsCollectionRef, setGroupsCollectionRef ] = React.useState<DocumentData>();
  const [ groups, setGroups ] = React.useState([]);
  const [ loading, setLoading ] = React.useState(false);
  const { getCurrentUserUid } = useAuth();
  const userUid = getCurrentUserUid();

  React.useEffect(() => {
    const ref = collection(FIRESTORE_DB, 'groups');
    const q = query(ref, orderBy('dateCreated', 'asc'));
    setGroupsCollectionRef(ref);
    const unsuscribe = onSnapshot(q, (groups: DocumentData) => {
      
      const groupsData = groups.docs.map((doc: DocumentData) => {
        return { id: doc.id, ...doc.data() };
      })
      console.log("Current groups in database: ", groupsData);
      setGroups(groupsData);
    });
    return unsuscribe;
  }, [])

  
  // ingresando informacion a firebase  
  const startGroup = async() => {
    console.log('start groups');
    try {
      setLoading(true);
      const docRef = await addDoc(groupsCollectionRef, {
        name: `Group #${Math.floor(Math.random() * 1000)}`,
        description: 'This is a chat',
        creator: userUid,
        dateCreated: serverTimestamp(),
      })
      console.log("@@ Document written with ID: ", docRef.id);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <Spinner visible={loading}/>
        {groups.map((groups) => (
          <Link key={groups.id} href={`/(app)/groups/${groups.id}`} asChild>
            <TouchableOpacity style={styles.groupCard}>
              <Text>{groups.name}</Text>
              <Text>{groups.description}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>
      <Pressable style={styles.fab} onPress={startGroup}>
        <Ionicons name='add' size={24} color={"white"} />
      </Pressable>
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