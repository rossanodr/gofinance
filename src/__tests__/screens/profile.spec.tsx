import React from "react";
import { render } from "@testing-library/react-native";
import { Profile } from "../../screens/Profile";

test("verifies if shows the user input name placeholder correctly", () => {
  const { debug } = render(<Profile />);
  debug();
});
