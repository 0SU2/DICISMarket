import { View, Text, StyleSheet, TextInput, Button, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import * as React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { DocumentData, addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/context/firebase/FirebaseConfig';
import { useAuth } from '@/context/AuthContext';

export default function IdChat() {
  const { getCurrentUserUid } = useAuth();
  const userUid = getCurrentUserUid(); 
  const [ messages, setMessages ] = React.useState<DocumentData[]>([]); 
  const { id } = useLocalSearchParams<{ id: string }>();
 
  const textRef = React.useRef('');
  const inputRef = React.useRef(null);

  // // coleccion de mensajes
  // React.useEffect(() => {
  //   // query para arreglar los mensajes
  //   const messageCollectionRef = collection(FIRESTORE_DB, `groups/${id}/messages`)
  //   const q = query(messageCollectionRef, orderBy("createdAt", "asc"));
  //   const unsuscribe = onSnapshot(q, (groups: DocumentData) => {
  //     const messagesData = groups.docs.map((doc: DocumentData) => {
  //       return { id: doc.id, ...doc.data() };
  //     })
  //     console.log(messagesData);
  //     setMessages(messagesData);
  //   });
  //   return unsuscribe;
  // })
 
  React.useEffect(() => {
    createRoomIfNotExists();
    let roomId = id;
    const docRef = doc(FIRESTORE_DB, "rooms", roomId);
    const messageRef = collection(docRef, "messages");
    const q = query(messageRef, orderBy("createdAt", 'asc'));
    
    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map(doc => {
        return doc.data();
      })
      console.log("@@ Messages of the roomL: ",allMessages);
      
      setMessages([...allMessages]);
    })

    return unsub;
  }, []);

  const createRoomIfNotExists = async () => {
    // roomId
    let roomId = id
    await setDoc(doc(FIRESTORE_DB, 'rooms', id), {
      id,
      createdAt: serverTimestamp(),
    })
  }


  const sendMessage = async() => {
    let message = textRef.current.trim();
    if (!message) return;
    try {
      let room = id;
      const docRef = doc(FIRESTORE_DB, 'rooms', room);
      const messagesRef  = collection(docRef, "messages");
      textRef.current = "";
      if(inputRef) inputRef?.current?.clear();
      const newDoc = await addDoc(messagesRef, {
        userId: userUid,
        text: message,
        createdAt: serverTimestamp(),
      });
      console.log("new message id: ", newDoc.id);
      
    } catch (error:any) {
      Alert.alert('Message', error.message)
      
    }
  }

  const renderMessage = ({item}:{item:DocumentData}) => {
    const myMessages = item.userId === userUid;
    return (
      <View style={[styles.messageContainer, myMessages ? styles.userMessageContainer : styles.otherMessageContainer]}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.time}>{item.createdAt?.toDate().toLocaleDateString()}</Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'android' ? 150 : 100}>
      <View style={styles.container}>
        <FlatList data={messages} keyExtractor={(item) => item.id} renderItem={renderMessage}/>
        <View style={styles.inputContainer}>
          <TextInput 
            ref={inputRef}
            multiline
            onChangeText={value => textRef.current = value} 
            style={styles.messageInput}/>
          <Button title='Send' onPress={sendMessage}/>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
    backgroundColor: '#fff',
  },
  messageInput: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
  messageContainer: {
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessageContainer: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start'
  },
  messageText: {
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: '#777',
  }
})
