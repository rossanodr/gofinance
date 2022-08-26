import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;
import * as AuthSession from "expo-auth-session";
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  signOut(): Promise<void>;
  loadingUser: boolean;


}
interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}
const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [loadingUser, setLoadingUser] = useState(true);
  const userStorageKey = '@gofinance:user';
  async function signInWithGoogle() {
    try {
      console.log(REDIRECT_URI);
      await AsyncStorage.removeItem(userStorageKey);

      const RESPONSE_TYPE = "token";
      const SCOPE = encodeURI("profile email");

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { type, params } = (await AuthSession.startAsync({
        authUrl,
      })) as AuthorizationResponse;
      if (type === "success") {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`
        );
        const userInfo = await response.json();
        
        const userLogged = {
          id: userInfo.id,
          name: userInfo.given_name,
          email: userInfo.email,
          photo: userInfo.picture,
          // photo: `https://ui-avatars.com/api/?name=${userInfo.given_name}&length=1`

        }
        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
        // console.log(userLogged);
      }
    } catch (error: any) {
      throw (new Error(error), console.log("signInWithGoogle error" + error));
    }
  }

  async function signInWithApple(){
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,

        ]
      })
      if(credential){
        const userLogged = {
          id: String(credential.user),
          name: credential.fullName?.givenName!,
          email: credential.email!,
          photo: `https://ui-avatars.com/api/?name=${credential.fullName?.givenName!}&length=1`
        };
        setUser(userLogged)
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));

      }
    } catch (error: any) {
      throw (new Error(error), console.log("signInWithApple error" + error));

    }
  }

  async function signOut(){
    setUser({} as User)
    await AsyncStorage.removeItem(userStorageKey);
  }

  useEffect(()=>{
    async function loadUserStorageData(): Promise<void> {
      const userStorage = await AsyncStorage.getItem(userStorageKey);
      if(userStorage){
        const userLogged = JSON.parse(userStorage) as User;
        setUser(userLogged)
      }
      setLoadingUser(false)
    }
    loadUserStorageData();
  },[])
  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signInWithApple, signOut, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
