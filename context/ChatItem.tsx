import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Image } from 'expo-image'
import { router } from 'expo-router'

export default function ChatItem({item, index}: {item:never}) {
  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const openChatRoom = () => {
    router.push({pathname: '/(app)/chat/groups/chatRoom', params: item})
  }

  return (
    <TouchableOpacity onPress={openChatRoom} style={styles.groupCard}>

      <Image
        source={item?.profileUrl}
        style={styles.image}
        placeholder={{ blurhash }}
        contentFit='cover'
        contentPosition={'center'}
        transition={500}
      />

      {/* name and last message */}

      <View style={styles.userNameMessage}>
        <View style={styles.userNameProfileName}>
          <Text style={{fontWeight: 'bold', fontSize: 20}}>{item?.username}</Text>
        </View>
        <Text style={{fontWeight: '300', fontSize: 14}}>{index}</Text>
      </View>


    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  groupCard: {
    paddingTop: 10,
    backgroundColor: '#fff',
    paddingLeft: 10,
    marginTop: 10,
    elevation: 4,
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