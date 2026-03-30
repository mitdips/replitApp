import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthTokenGetter, setBaseUrl } from "@workspace/api-client-react";
import { router } from "expo-router";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

setBaseUrl(`https://${process.env.EXPO_PUBLIC_DOMAIN}`);

type UserProfile = {
  id: number;
  name: string;
  email: string;
};

type AuthState = {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
};

type AuthContextType = AuthState & {
  login: (user: UserProfile, token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "@auth_token";
const USER_KEY = "@auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const [token, userStr] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (token && userStr) {
          const user = JSON.parse(userStr) as UserProfile;
          setState({ user, token, isLoading: false });
          setAuthTokenGetter(() => token);
        } else {
          setState({ user: null, token: null, isLoading: false });
        }
      } catch {
        setState({ user: null, token: null, isLoading: false });
      }
    })();
  }, []);

  const login = useCallback(async (user: UserProfile, token: string) => {
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, token),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
    ]);
    setAuthTokenGetter(() => token);
    setState({ user, token, isLoading: false });
  }, []);

  const logout = useCallback(async () => {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ]);
    setAuthTokenGetter(() => null);
    setState({ user: null, token: null, isLoading: false });
    router.replace("/");
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
