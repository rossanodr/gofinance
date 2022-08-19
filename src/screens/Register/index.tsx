import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import uuid from "react-native-uuid";

import * as Yup from "yup";
import { Button } from "../../components/Forms/Button";
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton";
import { InputForm } from "../../components/Forms/InputForm";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";
import { CategorySelectModal } from "../CategorySelectModal";

import {
  Container,
  Fields,
  Form,
  Header,
  Title,
  TransactionTypes,
} from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object()
  .shape({
    name: Yup.string().required("Nome é obrigatório"),
    amount: Yup.number()
      .typeError("Informe um valor numérico")
      .positive("O valor não pode ser negativo")
      .required("O valor é obrigatório"),
  })
  .required();

export function Register() {
  const [transactionType, setTransactionType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const dataKey = "@gofinances:transactions";

  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  });

  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function handleTransactionType(type: "positive" | "negative") {
    setTransactionType(type);
  }

  function handleOpenSelectCategoryModal() {
    setModalOpen(true);
  }

  function handleCloseSelectCategoryModal() {
    setModalOpen(false);
  }

  async function handleRegister(form: Partial<FormData>) {
    if (!transactionType) {
      return Alert.alert("Selecione o tipo da transação");
    }
    if (category.key === "category") {
      return Alert.alert("Selecione a categoria");
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    };
    try {

      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [...currentData, newTransaction];

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      reset();
      setTransactionType("");
      setCategory({
        key: "category",
        name: "Categoria",
      });
      navigation.navigate("Listagem");
    } catch (error) {
      console.log("handleRegister error" + error);
      Alert.alert("Não foi possível salvar");
    }
  }

  useEffect(() => {
    async function loadData() {
      const data = await AsyncStorage.getItem(dataKey);
      console.log("data", JSON.parse(data!));
      // await AsyncStorage.removeItem(dataKey);
    }
    loadData();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Register</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCorrect={false}
              autoCapitalize="sentences"
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />
            <TransactionTypes>
              <TransactionTypeButton
                title="Incomes"
                type="up"
                onPress={() => handleTransactionType("positive")}
                isActive={transactionType === "positive"}
              />
              <TransactionTypeButton
                title="Incomes"
                type="down"
                onPress={() => handleTransactionType("negative")}
                isActive={transactionType === "negative"}
              />
            </TransactionTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>

          <Button title={"Enviar"} onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal visible={modalOpen}>
          <CategorySelectModal
            category={category}
            setCategory={setCategory}
            closeSelectedCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
