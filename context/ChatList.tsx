import { FlatList, SafeAreaView } from 'react-native'
import React from 'react'
import ChatItem from './ChatItem'
import { DocumentData } from 'firebase/firestore'

export default function ChatList({users}:{users:DocumentData}) {
  
  return (
    <SafeAreaView style={{flex:1}}>
      <FlatList
        data={users}
        key={users.userId}
        renderItem={({item, index}) => 
          <ChatItem 
            item={item} 
            index={index}
          />
        }
      />

    </SafeAreaView>
  )
}