import * as React from 'react'
import { useState } from 'react';
import { StyleSheet, Pressable, TextInput, View, Text, Appearance, useColorScheme, TouchableOpacity, Alert, TurboModuleRegistry } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTogglePasswordVisibility } from '@/context/TogglePassword';
import ButtonGradiant from '@/context/ButtonGradiant';
import Spinner from 'react-native-loading-spinner-overlay';
import { useAuth } from '@/context/AuthContext';
import { newLoginUser, userDataFirestore } from '@/context/firebase/FirebaseConfig';
import { Link } from 'expo-router';

export default function RegisterTab() {
  const { passwordVisibility, rightIcon, handlePasswordVisibility } = useTogglePasswordVisibility();
  const [ password, setPassword ] = React.useState<string>('123456');
  const [ email, setEmail ] = React.useState<string>('osukar1910@gmail.com')
  const [loading, setLoading] = useState<boolean>(false);
  const { signIn } = useAuth()

  // solamente para cambiar de color 
  const colorScheme = useColorScheme();
  const themeStyleText = colorScheme === 'dark' ? styles.textoBlanco: styles.textoNegro;

  const handelLogin = async() => {
    setLoading(true);
    if(email.trim() === '' || password.trim() === '') {
      Alert.alert("Error", "Rellene bien las casillas");
      return;
    }
    const response = await newLoginUser(email, password);
    
    if(!response.success) {
      Alert.alert("Error", response.msg);
      setLoading(false);
      return;
    }

    const firestoreResponse = await userDataFirestore(response.msg.uid);
    
    signIn(response.msg.uid, firestoreResponse);
    setLoading(false);
    return;
  }

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />
      <Text style={[styles.textBienvenida, themeStyleText]}>Hello</Text>
      <Text style={[styles.textSubTitulo ]}>Sign In to your account</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.inputField}
          placeholder='Correo'
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Contraseña"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"
          secureTextEntry={passwordVisibility}
          value={password}
          enablesReturnKeyAutomatically
          onChangeText={text => setPassword(text)}
        />
        <Pressable onPress={handlePasswordVisibility}>
          <Ionicons name={rightIcon} size={22} color="#232323" />
        </Pressable>
      </View>
      <TouchableOpacity onPress={handelLogin} >
        <ButtonGradiant text="Log In"/>
      </TouchableOpacity>
      <View style={styles.containerSignUp}>
        <Text style={{ fontWeight: '600', fontSize: 15 }}>Don't have an account? </Text>
        <Link href={"/registrar"} asChild>
          <Text style={{ fontSize: 15, fontWeight: '600', color: "#e3c000", textDecorationLine: 'underline' }}>Sign Up</Text>
        </Link>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBienvenida: {
    fontSize: 80,
    fontWeight: "bold",
  },
  textSubTitulo: {
    fontSize: 20,
    color: "gray",
  },
  // estos textos es por si cambian el thema de color
  textoBlanco: { color: 'white'},
  textoNegro: { color: '#34434D'},
  //
  inputContainer: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#d7d7d7',
    paddingStart: 5,
    marginTop: 5,
    margin: 5
  },
  inputField: {
    padding: 9,
    fontSize: 15,
    width: '90%'
  },
  containerSignUp: {
    flexDirection: 'row'
  }
});