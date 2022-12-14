import React from "react";
import { render } from "@testing-library/react-native";
import { Input } from ".";
import { ThemeProvider } from "styled-components/native";
import theme from "../../../global/styles/theme";

const Providers: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe("Input Component", () => {
  it("must have a specific color when active ", () => {
    const { getByTestId } = render(
      <Input
        testID="input-email"
        placeholder="Email"
        keyboardType="email-address"
        autoCorrect={false}
        active={true}
      />,
      {
        wrapper: Providers,
      }
    );

    const inputComponent = getByTestId("input-email");
    expect(inputComponent.props.style[0].borderColor).toEqual("#E83F5B");

    expect(inputComponent.props.style[0].borderWidth).toEqual(3);
  });
});
