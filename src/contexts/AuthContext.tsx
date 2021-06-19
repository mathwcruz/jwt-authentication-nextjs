import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { setCookie, parseCookies } from "nookies";
import Router from "next/router";

import { recoverUserInformation, signInRequest } from "../services/auth";
import { api } from "../services/api";

interface User {
  name: string;
  email: string;
  avatar_url: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: User;
  signIn: (data: SignInData) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      recoverUserInformation().then((response) => {
        setUser(response?.user);
      });
    }
  }, []);

  async function signIn({ email, password }: SignInData) {
    const { token, user } = await signInRequest({
      email,
      password,
    });

    setCookie(undefined, "nextauth.token", token, {
      maxAge: 60 * 60 * 1, // => 1 hour
    });

    api.defaults.headers["Authorization"] = `Bearer ${token}`;

    setUser(user);

    Router.push("/dashboard");
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
