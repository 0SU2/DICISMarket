import { useRouter, useSegments } from 'expo-router';
import * as React from 'react';

// no se tiene ningun usuario al inicio, por eso se deja como null
const AuthContext = React.createContext<any>(null);

// crear hook para usar el provider que acabamos de crear
export function useAuth() {
  return React.useContext(AuthContext)
}

export function AuthProvider({children}:React.PropsWithChildren) {
  const rootSegment = useSegments()[0];
  const router = useRouter(); // nos permite navegar entre paginas
  const [user, setUser] = React.useState<string | undefined>("");
  const [userUid, setUserUid] = React.useState<string | undefined>("")
  
  // usar un useEffect para revisar si tenemos un usuario al cargar la pagina por primera vez
  React.useEffect(() => {
    // si no hay un usuario no tenemos que hacer nada
    if (user === undefined || userUid === undefined) {
      return;
    }
    if(!user && !userUid && rootSegment !== "(auth)") {
      router.replace("/(auth)/login")
    } else if (user && rootSegment !== "(app)") {
      router.push({
        pathname: "/(app)/profile",
      })
    } 
  }, [user, userUid, rootSegment]);
 
  return(
    <AuthContext.Provider
      value={{
        user: user,
        signIn: (correo:string, userUid:string) => {
          setUser(correo);
          setUserUid(userUid)
        },
        signOut: () => {
          // funcion para eliminar la sesion del usuario
          setUser("");
          setUserUid("");
        },
        getCurrentUser: () => {
          return user;
        },
        getCurrentUserUid: () => {
          return userUid;
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}