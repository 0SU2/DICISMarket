import { View, Text, StyleSheet, TextInput, Button, FlatList, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { DocumentData, addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/context/firebase/FirebaseConfig';
import { useAuth } from '@/context/AuthContext';

export default function IdChat() {
  const { getCurrentUserUid } = useAuth();
  const userUid = getCurrentUserUid(); 
  const [ messages, setMessages ] = React.useState<DocumentData[]>([]); 
  const [ message, setMessage ] = React.useState<string>("");
  const { id } = useLocalSearchParams<{ id: string }>();
 
  // coleccion de mensajes
  useLayoutEffect(() => {
    // query para arreglar los mensajes
    const messageCollectionRef = query(collection(FIRESTORE_DB, `groups/${id}/messages`), orderBy('createdAt', 'asc'));
    const unsuscribe = onSnapshot(messageCollectionRef, (groups: DocumentData) => {
      const messagesData = groups.docs.map((doc: DocumentData) => {
        return { id: doc.id, ...doc.data() };
      })
      setMessages(messagesData);
    });
    return unsuscribe;
  })

  const sendMessage = async() => {
    if( message.trim() === '' ) return;

    await addDoc(collection(FIRESTORE_DB, `groups/${id}/messages`), {
      message: message,
      sender: userUid,
      createdAt: serverTimestamp(),
    });


    setMessage('');
  }

  const renderMessage = ({item}:{item:DocumentData}) => {
    const myMessages = item.sender === userUid;
    return (
      <View style={[styles.messageContainer, myMessages ? styles.userMessageContainer : styles.otherMessageContainer]}>
          <Text style={styles.messageText}>{item.message}</Text>
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
            multiline
            value={message}
            onChangeText={(text) => setMessage(text)} 
            style={styles.messageInput}/>
          <Button disabled={message === ''} title='Send' onPress={sendMessage}/>
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
  },
  messageText: {
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: '#777',
  }
})
