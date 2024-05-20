// NOTA: Este archivo no lo encuentra si esta dentro del server, pero si esta dentro del client si va a funciona
import { getApp, getApps, initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence ,createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDoc, getFirestore } from 'firebase/firestore';
import { setDoc, doc } from 'firebase/firestore'

// env variables para la configuracion de firebase, debes agregarlas en tu archivo .env con los nombres que se indican
// esto para mayor seguridad
import { API_KEY, AUTHDOMAIN, PROYECTID, STORAGEBUCKET, MESSAGINGSENDERID, APPID, MEASUREMENTID } from '@env'

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTHDOMAIN,
  projectId: PROYECTID,
  storageBucket: STORAGEBUCKET,
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID,
  measurementId: MEASUREMENTID,
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
const newRegisterUser = async(email,password, username, profileURL) => {
  console.log("Registrando usuario...");
  try {
    const response = await createUserWithEmailAndPassword(auth, email, password);
    
    if(!profileURL) {
      profileURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
    }

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