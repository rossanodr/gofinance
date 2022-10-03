import React from "react";
import { View, Text, TextInput, Button } from "react-native";

export function Profile() {
  return (
    <View>
      <Text>Perfil</Text>
      <TextInput placeholder="Nome" autoCorrect={false}></TextInput>
      <TextInput placeholder="Sobrenome" autoCorrect={false}></TextInput>
      <Button title="Salvar" onPress={() => {}}></Button>
    </View>
  );
}
