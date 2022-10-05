import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import theme from '../../global/styles/theme';

import { Register } from '.';

jest.mock('../../hooks/useAuth.tsx', () => ({
    useAuth: () => ({
        user: {
            id: '123'
        }
    })
}))

jest.mock('@react-navigation/native');

const Providers: React.FC = ({ children }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  );
  

describe('Register Screen', () => {
    it('should open the category modal when the user clicks the category button', () => {
        const {getByTestId} =  render(
            <Register />, {
                wrapper: Providers
            }
        );
        const categoryModal = getByTestId('category-modal');
        const categoryButton = getByTestId('category-button');
            fireEvent.press(categoryButton)
        expect(categoryModal.props.visible).toBeTruthy();

    })
})