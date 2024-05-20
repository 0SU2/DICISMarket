import { View, Text, StyleSheet, TouchableOpacity, Pressable, TextInput, useColorScheme, Alert } from 'react-native'
import * as React from 'react'
import Spinner from 'react-native-loading-spinner-overlay'
import ButtonGradiant from '@/context/ButtonGradiant'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { useAuth } from '@/context/AuthContext';
import { newRegisterUser } from '@/context/firebase/FirebaseConfig';
import { useTogglePasswordVisibility } from '@/context/TogglePassword';
import CustomKeyboardView from '@/context/CustomKeyboardView'

export default function RegisterTab() {
  const { passwordVisibility, rightIcon, handlePasswordVisibility } = useTogglePasswordVisibility();
  const [ loading, setLoading ] = React.useState<boolean>(false);
  const emailRef = React.useRef("");
  const usernameRef = React.useRef("");
  const passwordRef = React.useRef("");
  const confirmPasswordRef = React.useRef("");
  const profileUrl = React.useRef("");
  const colorScheme = useColorScheme();
  const themeStyleText = colorScheme === 'dark' ? styles.textoBlanco: styles.textoNegro;
  const { signIn } = useAuth();

  const handelRegister = async () => {
    setLoading(true);
    if (!emailRef.current || !usernameRef.current || !passwordRef.current || !confirmPasswordRef.current ) {
      Alert.alert("Error", "Rellene bien las casillas");
      setLoading(false);
      return;
    }
    if (passwordRef.current != confirmPasswordRef.current) {
      Alert.alert("Error", "La contraseñas no coinciden");
      setLoading(false);
      return;
    }

    // ya que se reviso que el usuario haya ingresado todos sus datos, los
    // vamos a mandar a firebase y le creamos su apartado en firestore
    let response = await newRegisterUser(emailRef.current, passwordRef.current, usernameRef.current, profileUrl.current);
    console.log("user register: ", response);

    if(!response.success) {
      Alert.alert('Error', response.msg);
      setLoading(false);
      return
    }

    signIn(response.uid, response.msg);

    emailRef.current="";
    usernameRef.current="";
    passwordRef.current="";
    confirmPasswordRef.current="";
    profileUrl.current="";

    setLoading(false);
    return;
  }

  return (

    <View style={styles.container}>

      <Spinner visible={loading} />
      <Text style={[styles.textBienvenida, themeStyleText]}>Sign Up</Text>
      <Text style={[styles.textSubTitulo ]}>Create your account</Text>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={(text) => usernameRef.current=text}
          placeholder='Nombre de usuario'
          style={styles.inputField}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={text => emailRef.current=text}
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
          enablesReturnKeyAutomatically
          onChangeText={text => passwordRef.current=text}
        />
        <Pressable onPress={handlePasswordVisibility}>
          <Ionicons name={rightIcon} size={22} color="#232323" />
        </Pressable>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Confirmar contraseña"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={passwordVisibility}
          enablesReturnKeyAutomatically
          onChangeText={text => confirmPasswordRef.current=text}
        />
        <Pressable onPress={handlePasswordVisibility}>
          <Ionicons name={rightIcon} size={22} color="#232323" />
        </Pressable>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Url para perfil"
          autoCorrect={false}
          onChangeText={text => profileUrl.current=text}
        />
      </View>
      <TouchableOpacity onPress={handelRegister} >
        <ButtonGradiant text="Sign Up"/>
      </TouchableOpacity>
      <View style={styles.containerSignUp}>
        <Text style={{ fontWeight: '600', fontSize: 15 }}>Already have an account? </Text>
        <Link href={"/login"} asChild>
          <Text style={{ fontSize: 15, fontWeight: '600', color: "#e3c000", textDecorationLine: 'underline' }}>Go back</Text>
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