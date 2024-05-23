import { View, Text, SafeAreaView, ScrollView, Platform, RefreshControl, StyleSheet, FlatList } from 'react-native'
import React from 'react'
import { createRandomThread, createRandomUser, generateThreads } from '@/utils/generate-dummy-data'
import Posts from '@/context/Posts';

export default function index() {
  const randomDataPosts = generateThreads();
  return (
    <SafeAreaView>
      <FlatList
        data={randomDataPosts}
        renderItem={({item}) => <Posts items={item}/>}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

})