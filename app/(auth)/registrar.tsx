import { View, Text, StyleSheet, TouchableOpacity, Pressable, TextInput, useColorScheme, Alert, ScrollView, LogBox } from 'react-native'
import * as React from 'react'
import Spinner from 'react-native-loading-spinner-overlay'
import ButtonGradiant from '@/context/ButtonGradiant'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { useAuth } from '@/context/AuthContext';
import { newRegisterUser } from '@/context/firebase/FirebaseConfig';
import { useTogglePasswordVisibility } from '@/context/TogglePassword';
import CustomKeyboardView from '@/context/CustomKeyboardView'

import { styles } from '@/styles'
import { Image, ImageBackground } from 'expo-image'
import { BlurView } from 'expo-blur'

const uri = 'https://i.pinimg.com/originals/8e/77/1a/8e771af40d04dc1577d89ab7d79bccb3.jpg'
const profilePicture = 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fdrh.ugto.mx%2Fassets%2Fabeja3.png&f=1&nofb=1&ipt=8c3ca2bddb06e599d51b436a0bb5ae64a59a7cbbb243a52a07dd5727847b3f2c&ipo=images';

export default function RegisterTab() {
  const { passwordVisibility, rightIcon, handlePasswordVisibility } = useTogglePasswordVisibility();
  const [ loading, setLoading ] = React.useState<boolean>(false);
  const emailRef = React.useRef("");
  const usernameRef = React.useRef("");
  const passwordRef = React.useRef("");
  const confirmPasswordRef = React.useRef("");
  const profileUrl = React.useRef("");
  
  const { signIn } = useAuth();

    // valores que recibe del registro
  const RegValues = (name:string, value:string) => forms({...input, [name]: value});
  
  const [input,forms] = React.useState({
    nombre:"",
    correo:"",
    contrasena:"",
    confirmContrasena:"",
  });

  const handelRegister = async () => {
    setLoading(true);
    if (!input.nombre || !input.correo || !input.contrasena ) {
      Alert.alert("Error", "Rellene bien las casillas");
      setLoading(false);
      return;
    }
    if (input.confirmContrasena != input.contrasena) {
      Alert.alert("Error", "La contraseñas no coinciden");
      setLoading(false);
      return;
    }
    if (!input.correo.endsWith('@ugto.mx')) {
      Alert.alert('Registration not allowed', 'Only emails from "@ugto.mx" are allowed.');
      setLoading(false);
      return;
    }

    // ya que se reviso que el usuario haya ingresado todos sus datos, los
    // vamos a mandar a firebase y le creamos su apartado en firestore
    let response = await newRegisterUser(input.correo.trim(), input.contrasena.trim(), input.nombre.trim());
    console.log("user register: ", response);

    if(!response.success) {
      Alert.alert('Error', response.msg);
      setLoading(false);
      return
    }
   
    RegValues("nombre","");
    RegValues("correo","");
    RegValues("contrasena","");
    RegValues("confirmContrasena","");
    
    signIn(response.uid, response.msg);
   
    setLoading(false);
    return;
  }

  return (

    <View style={styles.container}>
      <Spinner visible={loading} animation='fade'/>

      <ImageBackground 
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
          <View style={styles.register}>

            <Image 
              source={{uri:profilePicture}} 
              style={styles.profilePictureRegister}
              contentFit='cover'
              contentPosition={'center'}
              transition={200}
            />

            <Text style={styles.textBienvenida}>Registrate!</Text>

            <Text style={styles.Text}>E-mail</Text>

            <View style={styles.inputContainerLogin}>
              <TextInput 
                autoCorrect={false}
                autoCapitalize={'none'}
                onChangeText={text => RegValues("correo", text)} 
                style={styles.inputField} 
                placeholder='Enter your Email' 
                placeholderTextColor={'#9586A8'}
              />
            </View>
            
            <Text style={styles.Text}>Usuario</Text>

            <View style={styles.inputContainerLogin}>
              <TextInput 
                autoCorrect={false}
                onChangeText={text => RegValues("nombre",text)} 
                style={styles.inputField} 
                placeholder='Username' 
                placeholderTextColor={'#9586A8'}
              />
            </View>           
           
            <Text style={styles.Text}>Contraseña</Text>

            <View style={styles.inputContainerLogin}>
              <TextInput 
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={text => RegValues("contrasena", text)} 
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

            <Text style={styles.Text}>Confirmacion</Text>

            <View style={styles.inputContainerLogin}>
              <TextInput 
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={text => RegValues("confirmContrasena", text)} 
                style={styles.inputField} 
                enablesReturnKeyAutomatically
                placeholder='Re-enter your password' 
                placeholderTextColor={'#9586A8'} 
                secureTextEntry={passwordVisibility}

              />
              
              <Pressable onPress={handlePasswordVisibility} style={{ padding: 5 }}>
                <Ionicons name={rightIcon} size={22} color="#232323" />
              </Pressable>
            
            </View>

            <TouchableOpacity onPress={handelRegister} style={[styles.button, {backgroundColor: '#2D0C57'}]}>
              <Text style={{fontSize: 17, fontWeight: '400', color: 'white'}}>Confirm</Text>
            </TouchableOpacity>

            <Link href={"/login"} asChild>
              <TouchableOpacity style={[styles.button, {backgroundColor: '#fff'}]}>
              <Text style={{fontSize: 17, fontWeight: '400', color: '#2D0C57'}}>Regresar</Text>
            </TouchableOpacity>
            </Link>

          </View>
        </BlurView>
      </ScrollView>
    </View>

    // <View style={styles.container}>

    //   <Spinner visible={loading} />
    //   <Text style={[styles.textBienvenida, themeStyleText]}>Sign Up</Text>
    //   <Text style={[styles.textSubTitulo ]}>Create your account</Text>
    //   <View style={styles.inputContainer}>
    //     <TextInput
    //       onChangeText={(text) => usernameRef.current=text}
    //       placeholder='Nombre de usuario'
    //       style={styles.inputField}
    //     />
    //   </View>
    //   <View style={styles.inputContainer}>
    //     <TextInput
    //       onChangeText={text => emailRef.current=text}
    //       style={styles.inputField}
    //       placeholder='Correo'
    //     />
    //   </View>
    //   <View style={styles.inputContainer}>
    //     <TextInput
    //       style={styles.inputField}
    //       placeholder="Contraseña"
    //       autoCapitalize="none"
    //       autoCorrect={false}
    //       textContentType="newPassword"
    //       secureTextEntry={passwordVisibility}
    //       enablesReturnKeyAutomatically
    //       onChangeText={text => passwordRef.current=text}
    //     />
    //     <Pressable onPress={handlePasswordVisibility}>
    //       <Ionicons name={rightIcon} size={22} color="#232323" />
    //     </Pressable>
    //   </View>
    //   <View style={styles.inputContainer}>
    //     <TextInput
    //       style={styles.inputField}
    //       placeholder="Confirmar contraseña"
    //       autoCapitalize="none"
    //       autoCorrect={false}
    //       secureTextEntry={passwordVisibility}
    //       enablesReturnKeyAutomatically
    //       onChangeText={text => confirmPasswordRef.current=text}
    //     />
    //     <Pressable onPress={handlePasswordVisibility}>
    //       <Ionicons name={rightIcon} size={22} color="#232323" />
    //     </Pressable>
    //   </View>
    //   <View style={styles.inputContainer}>
    //     <TextInput
    //       style={styles.inputField}
    //       placeholder="Url para perfil"
    //       autoCorrect={false}
    //       onChangeText={text => profileUrl.current=text}
    //     />
    //   </View>
    //   <TouchableOpacity onPress={handelRegister} >
    //     <ButtonGradiant text="Sign Up"/>
    //   </TouchableOpacity>
    //   <View style={styles.containerSignUp}>
    //     <Text style={{ fontWeight: '600', fontSize: 15 }}>Already have an account? </Text>
    //     <Link href={"/login"} asChild>
    //       <Text style={{ fontSize: 15, fontWeight: '600', color: "#e3c000", textDecorationLine: 'underline' }}>Go back</Text>
    //     </Link>
    //   </View>

    //   </View>

  )
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   textBienvenida: {
//     fontSize: 80,
//     fontWeight: "bold",
//   },
//   textSubTitulo: {
//     fontSize: 20,
//     color: "gray",
//   },
//   // estos textos es por si cambian el thema de color
//   textoBlanco: { color: 'white'},
//   textoNegro: { color: '#34434D'},
//   //
//   inputContainer: {
//     backgroundColor: 'white',
//     width: '80%',
//     borderRadius: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: '#d7d7d7',
//     paddingStart: 5,
//     marginTop: 5,
//     margin: 5
//   },
//   inputField: {
//     padding: 9,
//     fontSize: 15,
//     width: '90%'
//   },
//   containerSignUp: {
//     flexDirection: 'row'
//   }
// });