import { router } from "expo-router";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { auth } from "@/lib/firebase";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearEmployees } from "@/store/employeeSlice";
import { clearAuth, setAuthLoading, setAuthUser } from "@/store/authSlice";

type UserProfile = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: UserProfile | null;
  isLoading: boolean;
};

type AuthContextType = AuthState & {
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function mapUser(user: User): UserProfile {
  return {
    id: user.uid,
    name: user.displayName?.trim() || user.email?.split("@")[0] || "User",
    email: user.email || "",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const state = useAppSelector((root) => root.auth);

  useEffect(() => {
    dispatch(setAuthLoading(true));
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      dispatch(setAuthUser(firebaseUser ? mapUser(firebaseUser) : null));
    });

    return unsubscribe;
  }, [dispatch]);

  const logout = useCallback(async () => {
    await signOut(auth);
    dispatch(clearAuth());
    dispatch(clearEmployees());
    router.replace("/");
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ ...state, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
