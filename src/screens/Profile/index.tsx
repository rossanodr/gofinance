import React from "react";
import { View, Text, TextInput, Button } from "react-native";

export function Profile() {
  return (
    <View>
      <Text
      testID="text-title">Perfil</Text>
      <TextInput 
      testID="input-name"
      placeholder="Nome" autoCorrect={false}
        value="Rossano"
      />
      
      <TextInput
      testID="input-surname"
      placeholder="Sobrenome" autoCorrect={false}
        value="Dala Rosa"
      />
     
      <Button title="Salvar" onPress={() => {}}></Button>
    </View>
  );
}
