import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { getRoomId } from '@/utils/generate-id-room'
import { FIRESTORE_DB } from './firebase/FirebaseConfig'
import { DocumentData, collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useAuth } from './AuthContext'

export default function ChatItem({item}: {item:DocumentData}) {
  const { getCurrentUserUid } = useAuth();
  const userLogin = getCurrentUserUid(); // user logged
  const [ lastMessage, setLastMessage ] = React.useState<DocumentData[]>(null);
  
  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  React.useEffect(() => {
    let roomId = getRoomId(userLogin, item?.userId);
    const docRef = doc(FIRESTORE_DB, "rooms", roomId);
    const messageRef = collection(docRef, "messages");
    
    const queryMessages = query(messageRef, orderBy("createAt", 'desc'));

    let unsub = onSnapshot(queryMessages, (snapshot) => {
      let allMessages = snapshot.docs.map(doc => {
        return doc.data();
      });
      setLastMessage(allMessages[0]? allMessages[0]: null);
    })
    
    return unsub;
  }, []);

  const renderLastImage = () => {
    if(typeof lastMessage == null) return 'Loading...';
    if(lastMessage) {
      if(userLogin == lastMessage?.userId) return "You: "+lastMessage.text;
      return lastMessage?.text
    } else {
      return "No messages..."
    }
  }
  
  return (
    <View style={styles.groupCard} id={item?.userId}>
      <Image
        source={item?.profileUrl}
        style={styles.image}
        placeholder={{ blurhash }}
        contentFit='cover'
        contentPosition={'center'}
        transition={200}
      />
      <View style={styles.userNameMessage}>
        <View style={styles.userNameProfileName}>
          <Text style={{fontWeight: 'bold', fontSize: 20}}>{item?.username}</Text>
        </View>
        <Text style={{fontWeight: '300', fontSize: 14}}>{renderLastImage()}</Text>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  groupCard: {
    paddingTop: 10,
    backgroundColor: '#fff',
    paddingLeft: 10,
    marginTop: 10,
    flexDirection: 'row'
  },
  image: {
    borderRadius: 85,
    height: 70,
    marginBottom: 15,
    width: 70,
    margin: 5,
  },
  userNameMessage: {
    alignItems: 'flex-start',
    padding: 5,
    flex: 1,
  },
  userNameProfileName: {
    justifyContent: 'center',
    marginBottom: 10
  },
})  