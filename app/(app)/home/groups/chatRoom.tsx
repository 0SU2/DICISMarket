import { View, Text, KeyboardAvoidingView, FlatList, TextInput, StyleSheet, Platform, Button, TouchableOpacity } from 'react-native';
import * as React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { DocumentData, addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import ChatRoomHeader from '@/components/ChatRoomHeader';
import { useAuth } from '@/context/AuthContext';
import { FIRESTORE_DB } from '@/context/firebase/FirebaseConfig';
import { getRoomId } from '@/utils/generate-id-room';
import { Feather } from '@expo/vector-icons';

export default function chatRoom() {
  const { getCurrentUserUid } = useAuth();

  const item = useLocalSearchParams(); // second user
  const userLogin = getCurrentUserUid(); // user logged
  const [ messages, setMessages] = React.useState<DocumentData[]>([]);
  
  const [ textInput, setTextInput ] = React.useState<string>("");

  React.useEffect(() => {
    createRoomIfNotExists();
    
    let roomId = getRoomId(userLogin, item?.userId);
    const docRef = doc(FIRESTORE_DB, "rooms", roomId);
    const messageRef = collection(docRef, "messages");
    
    const queryMessages = query(messageRef, orderBy("createAt", 'asc'));

    let unsub = onSnapshot(queryMessages, (snapshot) => {
      let allMessages = snapshot.docs.map(doc => {
        return {...doc.data(), id: doc.id};
      });
      setMessages([...allMessages]);
    })
    
    return unsub;
  }, [])

  const createRoomIfNotExists = async() => {
    // roomId
    let roomId = getRoomId(userLogin, item?.userId);
    await setDoc(doc(FIRESTORE_DB, 'rooms', roomId), {
      roomId,
      createdAt: serverTimestamp(),
    });
  }

  const sendMessage = async() => {
    let message = textInput.trim();
    if(!message) return;
    try {
      let roomId = getRoomId(userLogin, item?.userId);
      const docRef = doc(FIRESTORE_DB, 'rooms', roomId);
      const messagesRef = collection(docRef, "messages");
      setTextInput("");
      const newDoc = await addDoc(messagesRef, {
        userId: userLogin,
        text: message,
        createAt: serverTimestamp(),
      })
      console.log("new message id: ", newDoc.id);
      
    } catch (error) {
      console.log("error => ", error);
      
    }
  }

  const renderMessages = ({item}:{item:DocumentData}) => {
    const myMessages = item?.userId === userLogin;
    return(
      <View style={[styles.messageContainer, myMessages ? styles.userMessageContainer : styles.otherMessageContainer]} key={item.id}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.time}>{item.createAt?.toDate().toLocaleDateString()}</Text>
      </View>
    )
  }
  
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'android' ? 210 : 200}>
      <View style={styles.container} >
        <ChatRoomHeader user={item} />
        <FlatList 
          data={messages} 
          keyExtractor={(item) => item.id} 
          renderItem={renderMessages}
        />
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Escribe...'
            value={textInput}
            onChangeText={value => setTextInput(value)}
            style={styles.messageInput}
          />
          <TouchableOpacity style={styles.buttonSend} onPress={sendMessage}>
            <Feather name="send" size={24} color="blue" />
          </TouchableOpacity>
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
  },
  buttonSend: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 30,
    elevation: 3,
    backgroundColor: 'white',
  },

})