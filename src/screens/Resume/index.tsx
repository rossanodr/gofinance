import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { HistoryCard } from "../../components/HistoryCard";
import { ChartContainer, Container, Content, Header, Title } from "./styles";
import { categories } from "../../utils/categories";
import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";

interface TransactionData {
  type: "positive" | "negative";
  name: string;
  amount: string;
  category: string;
  date: string;
}
interface CategoryDataProps {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}
export function Resume() {
  const [totalByCategory, setTotalByCategory] = useState<CategoryDataProps[]>(
    []
  );
  const theme = useTheme();
  async function loadData() {
    const dataKey = "@gofinances:transactions";

    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expenses = responseFormatted.filter(
      (expenses: TransactionData) => expenses.type === "negative"
    );

    const expensesTotal = expenses.reduce(
      (accumulator: number, expense: TransactionData) => {
        return accumulator + expense.amount;
      },
      0
    );

    const totalByCategory: CategoryDataProps[] = [];

    const categoriesData = categories.forEach((category) => {
      let categorySum = 0;

      expenses.forEach((expense: TransactionData) => {
        if (expense.category === category.key) {
          categorySum += Number(expense.amount);
        }
      });
      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const percent = `${((categorySum / expensesTotal) * 100).toFixed(0)}%`;
        totalByCategory.push({
          key: category.key,
          name: category.name,
          total: categorySum,
          color: category.color,
          totalFormatted,
          percent,
        });
      }
    });
    setTotalByCategory(totalByCategory);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  //   useEffect(()=> {
  //     loadData();
  //   },[])

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      <Content>
        <ChartContainer>
          <VictoryPie
            data={totalByCategory}
            x="percent"
            y="total"
            colorScale={totalByCategory.map((category) => category.color)}
            style={{
              labels: {
                fontSize: RFValue(18),
                fontWeight: "bold",
                fill: theme.colors.shape,
              },
            }}
            labelRadius={50}
          />
        </ChartContainer>
        {totalByCategory.map((item) => (
          <HistoryCard
            title={item.name}
            color={item.color}
            amount={item.totalFormatted}
            key={item.key}
          />
        ))}
      </Content>
    </Container>
  );
}
