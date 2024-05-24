// NOTA: Este archivo no lo encuentra si esta dentro del server, pero si esta dentro del client si va a funciona
import { getApp, getApps, initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence ,createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDoc, getFirestore } from 'firebase/firestore';
import { setDoc, doc } from 'firebase/firestore'

// env variables para la configuracion de firebase, debes agregarlas en tu archivo .env con los nombres que se indican
// esto para mayor seguridad
// import { API_KEY, AUTHDOMAIN, PROYECTID, STORAGEBUCKET, MESSAGINGSENDERID, APPID, MEASUREMENTID } from '@env'
const apiKey = process.env.EXPO_PUBLIC_API_KEY;
const authDomain = process.env.EXPO_PUBLIC_API_AUTHDOMAIN;
const projectId = process.env.EXPO_PUBLIC_API_PROYECTID;
const storageBucket = process.env.EXPO_PUBLIC_API_STORAGEBUCKET;
const messagingSenderId = process.env.EXPO_PUBLIC_API_MESSAGINGSENDERID;
const appId = process.env.EXPO_PUBLIC_API_APPID;
const measurementId = process.env.EXPO_PUBLIC_API_MEASUREMENTID; 


const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
};

// Inicializar firebase, previene que se reinicie en caso de que la pagina recargue
// provocando un error
let app, auth;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
    console.log("Iniciando firebase");
  } catch (error) {
    console.log("@@ Error de inicialización " + error);
  }
} else {
  app = getApp();
  auth = getAuth(app);
}

const FIRESTORE_DB = getFirestore(app);

// Iniciar sesion usuario 
const newLoginUser = async(email, password) => {
  console.log("Iniciando sesion...");
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, msg: response?.user }
  } catch (error) {
    let newMessage;
    switch (error.message) {
      case "Firebase: Error (auth/invalid-email).":
        newMessage = "Correo Invalido";
        break;
      case "Firebase: Error (auth/wrong-password)." :
        newMessage = "Contraseña incorrecta.";
        break;
      case "Firebase: Error (auth/email-already-in-use).":
        newMessage = "Correo ya en uso. Intente otro.";
        break;
      case "Firebase: Error (auth/user-not-found).":
        newMessage = "Usuario no registrado.";
        break;
      default:
        newMessage = error.message;
        break;
    }
    return { success: false, msg: newMessage }
  }
}

// Mandar la informacion del usuario de firestore
const userDataFirestore = async(userUID) => {
  console.log(userUID);
  try {
    const docRef = doc(FIRESTORE_DB, 'users', userUID);
    const docSnap = await getDoc(docRef);
    const dataFirestore = docSnap.data()
    return dataFirestore
  } catch (error) {
    console.log(error);
  }
}

// Iniciar sesión usuarios existentes
const newRegisterUser = async(email,password, username) => {
  console.log("Registrando usuario...");
  try {
    const response = await createUserWithEmailAndPassword(auth, email, password);
    const profileURL = "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fdrh.ugto.mx%2Fassets%2Fabeja3.png&f=1&nofb=1&ipt=8c3ca2bddb06e599d51b436a0bb5ae64a59a7cbbb243a52a07dd5727847b3f2c&ipo=images"

    await setDoc(doc(FIRESTORE_DB, 'users', response?.user?.uid), {
      email: response.user.email,
      username: username,
      profileUrl: profileURL,
      userId: response.user.uid,
    });

    return { success: true, msg: response?.user, uid: response?.user?.uid};
    
  } catch (error) {
    let newMessage;
    switch (error.message) {
      case "Firebase: Error (auth/invalid-email).":
        newMessage = "Correo Invalido";
        break;
      default:
        newMessage = error.message;
        break;
    }
    return { success: false, msg: newMessage }
  }
}

export const usersRef = collection(FIRESTORE_DB, 'users');
export const roomRef = collection(FIRESTORE_DB, 'rooms');

export { newLoginUser, newRegisterUser, FIRESTORE_DB , userDataFirestore };