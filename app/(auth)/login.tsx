import * as React from 'react'
import { StyleSheet, Pressable, TextInput, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTogglePasswordVisibility } from '@/context/TogglePassword';
import Spinner from 'react-native-loading-spinner-overlay';
import { useAuth } from '@/context/AuthContext';
import { newLoginUser, userDataFirestore } from '@/context/firebase/FirebaseConfig';
import { Link } from 'expo-router';

import { styles } from '@/styles';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';

const uri = 'https://i.pinimg.com/originals/8e/77/1a/8e771af40d04dc1577d89ab7d79bccb3.jpg'
const profilePicture = 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fdrh.ugto.mx%2Fassets%2Fabeja3.png&f=1&nofb=1&ipt=8c3ca2bddb06e599d51b436a0bb5ae64a59a7cbbb243a52a07dd5727847b3f2c&ipo=images';

export default function RegisterTab() {
  const { passwordVisibility, rightIcon, handlePasswordVisibility } = useTogglePasswordVisibility();
  const [ password, setPassword ] = React.useState<string>('123456');
  const [ email, setEmail ] = React.useState<string>('or@ugto.mx')
  const [loading, setLoading] = React.useState<boolean>(false);
  const { signIn } = useAuth()

  const handelLogin = async() => {
    setLoading(true);
    if(email.trim() === '' || password.trim() === '') {
      Alert.alert("Error", "Rellene bien las casillas");
      setLoading(false);
      return;
    }
    if (!email.endsWith('@ugto.mx')) {
      Alert.alert('Registration not allowed', 'Only emails from "@ugto.mx" are allowed.');
      setLoading(false);
      return;
    }
    const response = await newLoginUser(email, password);
       
    if(!response.success) {
      Alert.alert("Error", response.msg);
      setLoading(false);
      return;
    }

    signIn(response.msg)

    // const firestoreResponse = await userDataFirestore(response.msg.uid);
    
    // console.log(firestoreResponse);
    
    setLoading(false);
    return;
  }

  return (
    // new login user
    <View style={styles.container}>
      <Spinner visible={loading} animation='fade' />

      <Image 
        source={{ uri }} 
        style={[styles.image, StyleSheet.absoluteFill]}
        contentFit='cover'
        contentPosition={'center'}
        transition={200}
      />
      <ScrollView contentContainerStyle={{
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
      }}>

        <BlurView intensity={100} >
          <View style={styles.login}>

            <Image 
              source={{uri:profilePicture}} 
              style={styles.profilePicture}
              contentFit='cover'
              contentPosition={'center'}
              transition={100}
            />

            <Text style={styles.textBienvenida}>Bienvenido!</Text>

            <Text style={styles.Text}>E-mail</Text>

            <View style={styles.inputContainerLogin}>
              <TextInput 
                autoCorrect={false}
                autoCapitalize='none'
                value={email}
                onChangeText={(text) => setEmail(text)} 
                style={styles.inputField} 
                placeholder='Enter your Email' 
                placeholderTextColor={'#9586A8'}
              />
            </View>
            
            <Text style={styles.Text}>Password</Text>

            <View style={styles.inputContainerLogin}>
              <TextInput 
                autoCorrect={false}
                autoCapitalize="none"
                value={password}
                onChangeText={(text) => setPassword(text)} 
                style={styles.inputField} 
                enablesReturnKeyAutomatically
                placeholder='Enter your password' 
                placeholderTextColor={'#9586A8'} 
                secureTextEntry={passwordVisibility}

              />
              
              <Pressable onPress={handlePasswordVisibility} style={{ padding: 5 }}>
                <Ionicons name={rightIcon} size={22} color="#232323" />
              </Pressable>
            
            </View>

            <TouchableOpacity onPress={handelLogin} style={[styles.button, {backgroundColor: '#2D0C57'}]}>
              <Text style={{fontSize: 17, fontWeight: '400', color: 'white'}}>Login</Text>
            </TouchableOpacity>

            <Link href={"/registrar"} asChild>
              <TouchableOpacity style={[styles.button, {backgroundColor: '#fff'}]}>
              <Text style={{fontSize: 17, fontWeight: '400', color: '#2D0C57'}}>Create Account</Text>
            </TouchableOpacity>
            </Link>

          </View>
        </BlurView>
      </ScrollView>
    </View>

  )
}