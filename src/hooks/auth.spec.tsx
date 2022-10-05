import { renderHook, act } from "@testing-library/react-native";
import { AuthProvider, useAuth } from "./useAuth";

// 1- Abre uma tela para o usuário autenticar;
// 2- Retorna type e params;
// 3- fetch dos dados de perfil no servidor da google;

jest.mock('expo-auth-session', () => {
    return {
        startAsync: () => {
            return {
                type: 'success',
                params: {
                    access_token: 'google-token'
                }
            }
        }
    }
})

describe("Auth Hook", () => {
  it("should be able to sign in with Google account",async () => {
    global.fetch = jest.fn(()=> Promise.resolve({
        json: () => Promise.resolve({
            id: `userInfo.id`,
            email: `userInfo.email`,
            name: `userInfo.name`,
            photo: `userInfo.photo`,
            locale: `userInfo.locale`,
            verified_email: `userInfo.verified_email`,
        })
    })) as jest.Mock;
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });
   await act(()=>result.current.signInWithGoogle())

    expect(result.current.user).toBeTruthy();
  });

  it("user should not be connected if cancel authentication with Google",async () => {
   
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });
   await act(()=>result.current.signInWithGoogle())

    expect(result.current.user).toHaveProperty('id')
  });
});
