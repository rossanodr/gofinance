import React from "react";
import { getBottomSpace } from "react-native-iphone-x-helper";
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

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export default function Dashboard() {
  const data: DataListProps[] = [
    {
      id: "1",
      type: "positive",
      title: "Titulo",
      amount: "R$98.900.00,00",
      category: {
        name: "Category Name",
        icon: "dollar-sign",
      },
      date: "05/08/2022",
    },
    {
      id: "2",
      type: "positive",

      title: "Titulo",
      amount: "R$98.900.00,00",
      category: {
        name: "Category Name",
        icon: "dollar-sign",
      },
      date: "05/08/2022",
    },
    {
      id: "4",
      type: "negative",
      title: "Titulo",
      amount: "R$98.900.00,00",
      category: {
        name: "Category Name",
        icon: "coffee",
      },
      date: "05/08/2022",
    },
    {
      id: "3",
      type: "negative",

      title: "Titulo",
      amount: "R$98.900.00,00",
      category: {
        name: "Category Name",
        icon: "dollar-sign",
      },
      date: "05/08/2022",
    },
  ];

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo
              source={{
                uri: "https://avatars.githubusercontent.com/u/64752639?v=4",
              }}
            />
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Rodrigo</UserName>
            </User>
          </UserInfo>
          <LogoutButton>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>
      <HighlightCardsContainer>
        <HighlightCard
          type="up"
          title="Entradas"
          amount="R$99.000.00,00"
          lastTransaction="Última entrada dia 04/08/2022"
        />
        <HighlightCard
          type="down"
          title="Saídas"
          amount="R$100.00,00"
          lastTransaction="Última saída dia 03/08/2022"
        />

        <HighlightCard
          type="total"
          title="Total"
          amount="R$98.900.00,00"
          lastTransaction="01 à 04 de agosto"
        />
      </HighlightCardsContainer>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  );
}
