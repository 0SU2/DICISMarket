import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';

export default function (props:any) {
  return (
    <View style={styles.container} >
      <LinearGradient
        // Button Linear Gradient
        colors={['#fff', '#ffe527']}
        start={{x: 0, y:0}}
        end={{x:0.6, y:0.2}}  
        style={styles.button}
      >
        <Text style={styles.text}>{props.text}</Text>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    alignItems: 'center',
    margin: 10,
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'gray',
  },
});