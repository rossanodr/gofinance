import React, { useContext, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import AppleSvg from "../../assets/apple.svg";
import GoogleSvg from "../../assets/google.svg";
import LogoSvg from "../../assets/logo.svg";
import { SignInSocialButton } from "../../components/SignInSocialButton";
import { useAuth } from "../../hooks/useAuth";

import {
  Container,
  Footer,
  FooterWrapper,
  Header,
  SignInTitle,
  Title,
  TitleWrapper,
} from "./styles";


export function SignIn() {
  const {signInWithGoogle, signInWithApple} = useAuth();
  const [isLoading, setIsLoading] = useState(false)
  const theme = useTheme();

  async function handleSignInWithGoogle() {
  try {
    setIsLoading(true);
   return await signInWithGoogle()
  } catch (error) {
    console.log('handleSignInWithGoogle error: ' + error)
    Alert.alert('Não foi possível conectar com o Google')    
  } 
    setIsLoading(false);
 
}

async function handleSignInWithApple() {
  try {
    setIsLoading(true);

    return await signInWithApple()
  } catch (error) {
    console.log('handleSignInWithApple error: ' + error)
    Alert.alert('Não foi possível conectar com o Apple')    
  } 
    setIsLoading(false);
  
}
  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />
          <Title>
            {" "}
            Controle suas {"\n"} finanças de forma {"\n"} muito simples
          </Title>
        </TitleWrapper>
        <SignInTitle>
          Faça seu login com {"\n"} uma das contas abaixo
        </SignInTitle>
      </Header>
      <Footer>
    <FooterWrapper>
        <SignInSocialButton title='Entrar com Google' svg={GoogleSvg} onPress={handleSignInWithGoogle} />
        <SignInSocialButton title='Entrar com Apple' svg={AppleSvg}  onPress={handleSignInWithApple} />

    </FooterWrapper>
    {isLoading && <ActivityIndicator style={{marginTop: 18}} color={theme.colors.shape} />}
      </Footer>
    </Container>
  );
}
