import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";
import {
  Container,
  Header,
  HighlightCardsContainer,
  Icon,
  LoadingContainer,
  LogoutButton,
  Photo,
  Title,
  TransactionList,
  Transactions,
  User,
  UserGreeting,
  UserInfo,
  UserName,
  UserWrapper,
} from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";
import { useAuth } from "../../hooks/useAuth";

export interface DataListProps extends TransactionCardProps {
  id: string;
}
interface HighlightCardProps {
  total: string;
  lastTransaction: string;
}

interface HighlightCardData {
  entries: HighlightCardProps;
  expenses: HighlightCardProps;
  totalAmount: HighlightCardProps;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightCardData, setHighlightCardData] = useState<HighlightCardData>(
    {} as HighlightCardData
  );
  const theme = useTheme();
  const {signOut, user} = useAuth();

  function getLastTransactionDate(
    collection: DataListProps[],
    type: "positive" | "negative"
  ) {
    const collectionFiltered = collection
    .filter((transaction) => transaction.type === type);
    if (collectionFiltered.length === 0){
      return 0
    }
    const lastTransaction = new Date(Math.max.apply(
      Math, collectionFiltered      
        .map((transaction) => {
          return new Date(transaction.date).getTime();
        })
    ));
    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {month: 'long'})}`;
  }

  async function loadTransactions() {
    const dataKey = `@gofinance:transactions_user:${user.id}`
    const response = await AsyncStorage.getItem(dataKey);

    const transactions = response ? JSON.parse(response) : [];

    let entriesSum = 0;
    let expensesSum = 0;

    const transactionsFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        if (item.type === "positive") {
          entriesSum += Number(item.amount);
        } else {
          expensesSum += Number(item.amount);
        }

        const amount = Number(item.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const date = Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          date,
          category: item.category,
        };
      }
    );
    setTransactions(transactionsFormatted);

    const lastTransactionsEntries = getLastTransactionDate(
      transactions,
      "positive"
    );
    const lastTransactionsExpenses = getLastTransactionDate(
      transactions,
      "negative"
    );
    const totalInterval = lastTransactionsEntries === 0 ? 'N??o h?? transa????es o suficiente.' : `01 a ${lastTransactionsExpenses}`;

    const total = entriesSum - expensesSum;
    setHighlightCardData({
      entries: {
        total: entriesSum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: lastTransactionsEntries === 0 ? 'N??o h?? transa????es.' : `??ltima entrada dia ${lastTransactionsEntries}`,
      },
      expenses: {
        total: expensesSum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: lastTransactionsExpenses === 0 ? 'N??o h?? transa????es.' : `??ltima sa??da dia ${lastTransactionsExpenses}`,
      },
      totalAmount: {
        total: total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: totalInterval
      },
    });
    setIsLoading(false);
  }
  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadingContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: user.photo,
                  }}
                />
                <User>
                  <UserGreeting>Ol??,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={()=> signOut()}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighlightCardsContainer>
            <HighlightCard
              type="up"
              title="Entradas"
              amount={highlightCardData.entries.total}
              lastTransaction={highlightCardData.entries.lastTransaction}
            />
            <HighlightCard
              type="down"
              title="Sa??das"
              amount={highlightCardData.expenses.total}
              lastTransaction={highlightCardData.expenses.lastTransaction}
            />

            <HighlightCard
              type="total"
              title="Total"
              amount={highlightCardData.totalAmount.total}
              lastTransaction={highlightCardData.totalAmount.lastTransaction}

            />
          </HighlightCardsContainer>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
