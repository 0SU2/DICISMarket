import { View, Text } from 'react-native'
import React from 'react'

export default function RegisterTab() {
  // to-do
  // hay que agregar el user registrar de firebase, para que el usuario se registre,
  // al hacer esto tienes que agregar su UID en Firestore con el email que proporciono
  // y su username

  // ejemplo de la funcion para encontrarlo en el Firestore:
  // const doceLet = async () => {
  //   try {
  //     const docRef = doc(FIRESTORE_DB, 'users', userUid);
  //     const docSanp = await getDoc(docRef);
  //     if ( docSanp.exists()) {
  //       console.log("@@ Document data: ", docSanp.data());
  //     } else {
  //       console.log("@@ no such document!");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // ejemplo de la funcion para agregarlo en el Firestore:
  // const doceLet = async () => {
  //   try {
  //     await setDoc(doc(FIRESTORE_DB, 'users', 'AlskdjfoiD'), {
  //       email: "pene@gmail.com",
  //       username: "pene1"
  //     })
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
    <View>
      <Text>RegisterTab</Text>
    </View>
  )
}