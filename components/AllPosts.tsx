import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Alert } from 'react-native'
import React from 'react'
import { styles } from '@/styles';
import { Image } from 'expo-image';
import { blurhash } from '@/utils/blurhas';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/context/firebase/FirebaseConfig';
import { useAuth } from '@/context/AuthContext';
import { getRoomId } from '@/utils/generate-id-room';
import Spinner from 'react-native-loading-spinner-overlay';

export default function AllPostsComponent({item}) {
  const { getCurrentUserUid } = useAuth();
  const [ openModalMessages, setOpenModal ] = React.useState<boolean>(false);
  const [ loadingSpinner, setLoadingSpinner ] = React.useState<boolean>(false);
  const [ currentMessage, setCurrentMessage ] = React.useState<string>("");

  const modalIsClosed = () => {
    setOpenModal(false);
    setCurrentMessage("")
  }

  const sendMessage = async() => {
    setLoadingSpinner(true);
    if(currentMessage.trim() == "") {
      setLoadingSpinner(false);
      return;
    }
    // checar que no sea el mismo usuario
    if(item.uidUser == getCurrentUserUid() ) {
      setLoadingSpinner(false);
      return;
    }
    // revisar si el usuario existe en nuestros usuarios
    const docRefUser = doc(FIRESTORE_DB, "users", item.uidUser);
    const docSnapUser = await getDoc(docRefUser);

    // si no encuentra el usuario, lo creamos para poder mandar mensaje
    if(docSnapUser.exists()) {
      try {
        // ya que esta registraod en usuarios,
        // se debe crear el chatroom con el usuario al que se mando mensaje
        let roomId = getRoomId(getCurrentUserUid(), item.uidUser);
        await setDoc(doc(FIRESTORE_DB, "rooms", roomId), {
          roomId,
          createdAt: serverTimestamp(),
        });

        // ahora, se tiene que mandar el mensaje que el usuario escribio
        const docRoomRef = doc(FIRESTORE_DB, "rooms", roomId);
        const messageRef = collection(docRoomRef, "messages");
        const newMessage = await addDoc(messageRef, {
          userId: getCurrentUserUid(),
          text: currentMessage.trim() + "\nProducto: " + item.product,
          createAt: serverTimestamp(),
        })
        console.log("message send => ", newMessage.id);
        
        modalIsClosed()

      } catch (error) {
        console.log("Error => ", error);
        
      }
      setLoadingSpinner(false);
      return;
    }
    return;
  }
  
  return (
    <View style={styles.publicationContainer} key={item.id}>
      <Spinner visible={loadingSpinner} animation='fade' />
      <Modal
        visible={openModalMessages}
        transparent={true}
        animationType='slide'
        statusBarTranslucent={true}
      >
        <View style={myStyles.modalContent}>
          <View style={myStyles.modalCardContet}>
            <Text style={myStyles.modalContentTittle}>Mensaje a :</Text>
            <Text style={{ fontSize: 15, fontWeight: '500' }}>{item.username}</Text>
            <View style={myStyles.modalInputContainer}>
              <TextInput
                value={currentMessage}
                onChangeText={(text) => setCurrentMessage(text)}
                style={myStyles.modalInputField}
                placeholder={"Escriba su mensaje..." }
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 10, alignContent: 'center'}}>
              <TouchableOpacity
                style={[myStyles.modalButton, { backgroundColor: 'red', flexDirection: 'row' }]} 
                onPress={modalIsClosed}
              >
                <FontAwesome name="close" size={20} color="black" style={{ paddingRight: 10 }}/>
                <Text style={{ fontSize: 15 }}>Close</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[myStyles.modalButton, { flexDirection: 'row', backgroundColor: 'green' }]}
                onPress={() => { sendMessage() }}
              >
                <FontAwesome name="send" size={14} color='black' style={{ paddingRight: 10 }}/>
                <Text style={{ fontSize: 15 }}>Send</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>
      <Text style={styles.publicationHeader}>
        {item.username} - {item.createdAt?.toDate().toLocaleDateString()}
      </Text>
      <Text style={styles.publicationDetail}>Producto: {item.product}</Text>
      <Text style={styles.publicationDetail}>Precio: ${item.price}</Text>
      <Text style={styles.publicationDetail}>Descripcion: {item.description}</Text>
      <Text style={styles.publicationDetail}>Categoria: {item.category}</Text>
      <Text style={[styles.publicationDetail, item.availability ? { color: 'green' } : { color: 'red' } ]}>Availability: {item.availability ? "Disponible" : "Agotado"}</Text>
      {item.imageUrl && (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={{ width: 350, height: 300, borderRadius:10, alignSelf: 'center' }} 
          transition={200} 
          placeholder={{ blurhash }}
          contentFit='cover'
        />
      )}
      <View style={{ flexDirection: 'row', paddingTop: 10, paddingHorizontal: 5, alignSelf: 'center' }}>
        { item.uidUser === getCurrentUserUid() ?
          "" :
          <TouchableOpacity  
            style={myStyles.mandarMensageButton} 
            onPress={() => { 
              setOpenModal(true); 
            }}
            disabled={item.uidUser === getCurrentUserUid() }
          >
            <Ionicons name="chatbubble" size={20} color={"black"} />
            <Text style={{ marginLeft: 5 , fontWeight: 'bold', fontSize: 15 }}>Mandar Mensaje!</Text>
          </TouchableOpacity>
        }
      </View>
    </View>
  );
}

const myStyles = StyleSheet.create({
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
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
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
    color: 'black',
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'transparent',
    paddingStart: 5,
    marginTop: 10,
  },
  modalInputField: {
    padding: 8,
    fontSize: 14,
    width: '98%'
  },
  mandarMensageButton: {
    marginRight: 5, 
    flexDirection: 'row', 
    backgroundColor: '#a7e8ff', 
    width: '45%', 
    padding: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 8 
  },
  modalButtonGray: { backgroundColor: '#747474' },
  modalButtonGreen: { backgroundColor: 'green' },
  allPostBackgroundBlack: { backgroundColor: 'black' },
  allPostBackgroundWhite: { backgroundColor: 'white' },
  allPostColorTextBlack: { color: 'white' }, 
  allPostColorTextWhite: { color: 'black' }
})