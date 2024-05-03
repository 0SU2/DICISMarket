// NOTA: Este archivo no lo encuentra si esta dentro del server, pero si esta dentro del client si va a funciona
import { getApp, getApps, initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence ,createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

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
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch (error) {
    console.log("@@ Error de inicialización " + error);
  }
} else {
  app = getApp();
  auth = getAuth(app);
}

const FIRESTORE_DB = getFirestore(app);

// Iniciar sesión usuarios existentes
const loginUser = (email, password) => {
  console.log("Iniciando sesion...");
  return signInWithEmailAndPassword(auth, email, password)
}

const registerUser = (email, password) => {
  console.log("Registrando usuario...");
  return createUserWithEmailAndPassword(auth, email, password);
}

export { loginUser, FIRESTORE_DB };