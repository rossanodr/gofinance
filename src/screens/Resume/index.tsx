import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { HistoryCard } from "../../components/HistoryCard";
import {
  ChartContainer,
  Container,
  Content,
  Header,
  LoadingContainer,
  Month,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Title,
} from "./styles";
import { categories } from "../../utils/categories";
import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ActivityIndicator } from "react-native";

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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();

  function handleDateChange(action: "next" | "previous") {
    setIsLoading(true);
    if (action === "next") {
      const newDate = addMonths(selectedDate, 1);
      setSelectedDate(newDate);
      
    } else {
      const newDate = subMonths(selectedDate, 1);
      setSelectedDate(newDate);
      
    }
    setIsLoading(false);

  }
  async function loadData() {
    setIsLoading(true);

    const dataKey = "@gofinances:transactions";

    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expenses = responseFormatted.filter(
      (expenses: TransactionData) =>
        expenses.type === "negative" &&
        new Date(expenses.date).getMonth() === selectedDate.getMonth() &&
        new Date(expenses.date).getFullYear() === selectedDate.getFullYear()
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
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  //   useEffect(()=> {
  //     loadData();
  //   },[])

  return (
    <Container>
          <Header>
            <Title>Resumo por categoria</Title>
          </Header>
          {isLoading ? (
            <LoadingContainer>
              <ActivityIndicator color={theme.colors.primary} size="large" />
            </LoadingContainer>
          ) : (
            <>
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: useBottomTabBarHeight(),
            }}
          >
            <MonthSelect>
              <MonthSelectButton onPress={() => handleDateChange("previous")}>
                <MonthSelectIcon name="chevron-left" />
              </MonthSelectButton>
              <Month>
                {format(selectedDate, "MMMM, yyyy", { locale: ptBR })}
              </Month>
              <MonthSelectButton onPress={() => handleDateChange("next")}>
                <MonthSelectIcon name="chevron-right" />
              </MonthSelectButton>
            </MonthSelect>

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
        </>
      )}
    </Container>
  );
}
