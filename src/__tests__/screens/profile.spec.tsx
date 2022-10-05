import React from "react";
import { render } from "@testing-library/react-native";
import { Profile } from "../../screens/Profile";

describe("Profile Screen", () => {
  
  it("verifies if shows the user input name placeholder correctly", () => {
    const {  getByPlaceholderText } = render(<Profile />);
    const inputName = getByPlaceholderText('Nome')
     expect(inputName).toBeTruthy()
  });
  
  it("should be loaded the user data",()=> {
    const { getByTestId} = render(<Profile />);
  
    expect(getByTestId('input-name').props.value).toEqual('Rossano');
    expect(getByTestId('input-surname').props.value).toEqual('Dala Rosa');
  
  })
  
  it("check if title renders correctly ",()=> {
    const { getByTestId} = render(<Profile />);
  
    expect(getByTestId('text-title').props.children).toContain('Perfil')
    
  
  })
})
