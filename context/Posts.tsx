
import { View, Text, SafeAreaView, ScrollView, Platform, RefreshControl, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native'
import React from 'react'
import { createRandomThread, createRandomUser, generateThreads } from '@/utils/generate-dummy-data'
import { Image } from 'expo-image';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { timeAgo } from '@/utils/time-ago';
import { Thread } from '@/types/threads';
import { FontAwesome } from '@expo/vector-icons';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from './firebase/FirebaseConfig';
import { getRoomId } from '@/utils/generate-id-room';
import { useAuth } from './AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';

type TreathPost = {
  items: Thread
}

export default function Posts({items}:TreathPost) {
  const { getCurrentUserUid } = useAuth();

  const [ openModal, setOpenModal] = React.useState<boolean>(false);
  const [ buttonSendMessage, setButtonSendMessage ] = React.useState<boolean>(false);
  const [ editableSendMessageModal, setEditableSendMessage ] = React.useState<boolean>(true);
  const [ loadingSpinner, setLoadingSpinner ] = React.useState<boolean>(false);
  const [ currentMessage, setCurrentMessage ] = React.useState<string>("");
  const [ userToMessage, setUserToMessage ] = React.useState<string>("");
  const userLogin = getCurrentUserUid();

  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const colorButtonMensajeModal = buttonSendMessage ? styles.modalButtonGray : styles.modalButtonGreen;

  // mandar la informacion del usuario al que se quiere contactar
  const sendMessage = async() => {
    if(currentMessage.trim() === "") return
    // revisar si el usuario existe en nuestros usuarios
    const docRefUser = doc(FIRESTORE_DB, "users", items.author.id);
    const docSnapUser = await getDoc(docRefUser);
    // si no encuentra el usuario, lo creamos para poder mandar mensaje
    if(!docSnapUser.exists()) {
      setLoadingSpinner(true);
      try {
        await setDoc(doc(FIRESTORE_DB, "users", items.author.id), {
          email: items.author.email,
          username: items.author.username,
          profileUrl: items.author.photo,
          userId: items.author.id
        });
        
        // ya que esta registraod en usuarios,
        // se debe crear el chatroom con el usuario al que se mando mensaje
        let roomId = getRoomId(userLogin, items.author.id);
        await setDoc(doc(FIRESTORE_DB, "rooms", roomId), {
          roomId,
          createdAt: serverTimestamp(),
        });

        // ahora, se tiene que mandar el mensaje que el usuario escribio
        const docRoomRef = doc(FIRESTORE_DB, "rooms", roomId);
        const messageRef = collection(docRoomRef, "messages");
        const newMessage = await addDoc(messageRef, {
          userId: userLogin,
          text: currentMessage.trim(),
          createAt: serverTimestamp(),
        })
        console.log("message send => ", newMessage.id);
        
        setCurrentMessage("");
        setButtonSendMessage(true);
        setEditableSendMessage(false);
      } catch (error) {
        console.log("Error => ", error);
        
      }
      setLoadingSpinner(false);
      return;
    }
    console.log('Existe');
    return;
  }

  // cuando se haya enviado el mensaje,
  // el usuario ya no podra mandar otro hasta que 
  // el modal este cerrado
  const modalIsClosed = () => {
    setOpenModal(false);
    setUserToMessage("");
    setButtonSendMessage(false);
    setEditableSendMessage(true);
  }


  return (
    <View style={styles.container}>
      <Spinner visible={loadingSpinner} />
      <Modal 
        visible={openModal} 
        transparent={true} 
        animationType='slide' 
        statusBarTranslucent={true}
      >

        <View style={styles.modalContent}>
          <View style={styles.modalCardContet}>
            
            <Text style={styles.modalContentTittle}>Mandar Propuesta A</Text>
            <Text>{userToMessage}</Text>
            <View style={styles.modalInputContainer}>
              <TextInput
                editable={editableSendMessageModal}
                value={currentMessage}
                onChangeText={(text) => setCurrentMessage(text)}
                style={styles.modalInputField}
                placeholder={editableSendMessageModal ? "Escriba su mensaje..." : "Mensaje enviado correctamente!"}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 10, alignContent: 'center'}}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: 'red', flexDirection: 'row' }]} 
                onPress={modalIsClosed}
              >
                <FontAwesome name="close" size={20} color="black" style={{ paddingRight: 10 }}/>
                <Text style={{ fontSize: 15 }}>Close</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                disabled={buttonSendMessage}
                style={[styles.modalButton, { flexDirection: 'row' }, colorButtonMensajeModal]}
                onPress={() => { sendMessage() }}
              >
                <FontAwesome name="send" size={14} color="black" style={{ paddingRight: 10 }}/>
                <Text style={{ fontSize: 15 }}>Send</Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>

      <Image 
        source={items.author.photo} 
        style={styles.imageProfile}
        placeholder={{ blurhash }}
        transition={200}
        contentFit='cover'
      />
      <View style={styles.mainContainer} id={items.id}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={styles.userUsername}>{items.author.name}</Text>
          <Text>{timeAgo(items.createdAt)}</Text>
        </View>
        <Text style={styles.userContent}>{items.content}</Text>
        <Image
          source={items.image}
          style={styles.userImageContet}
          placeholder={{ blurhash }}
          contentFit='cover'
          transition={200}
        />
        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
     
          <TouchableOpacity style={{ marginRight: 5 }} onPress={() => {}}>
            <AntDesign name="like2" size={20} color="black" />
          </TouchableOpacity>

          <Text style={{ marginRight: 10 }}>{items.likesCount}</Text>

          <TouchableOpacity style={{ marginRight: 5 }} onPress={() => { setOpenModal(true); setUserToMessage(items.author.name) }}>
            <Ionicons name="chatbubble-outline" size={20} color="black" />
          </TouchableOpacity>

          <Text>{items.repliesCount}</Text>
        
        </View>
      </View>
      
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: Platform.select({ android: 20 }),
    borderBottomWidth: 0.5,
    borderColor: 'lightgrey',
    backgroundColor: 'white',
  },
  imageProfile: {
    width: 50,
    height: 50, 
    borderRadius: 50 
  },
  mainContainer: {
    marginLeft: 10,
    flex: 1,
  },
  userUsername: {
    fontWeight: '700',
  },
  userContent: {
    lineHeight: 20,
    marginTop: 5,
  },
  userImageContet: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginTop: 10,
    borderRadius: 10,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalCardContet: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center'
  },
  modalContentTittle: {
    textTransform: 'uppercase',
    fontSize: 18,
    fontWeight: '700'
  },
  modalButton: {
    width: '30%',
    marginTop: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modalInputContainer: {
    backgroundColor: '#c1c1c1',
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
    paddingStart: 5,
    marginTop: 10,
  },
  modalInputField: {
    padding: 8,
    fontSize: 14,
    width: '98%'
  },
  modalButtonGray: { backgroundColor: '#747474' },
  modalButtonGreen: { backgroundColor: 'green' }
})