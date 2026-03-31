import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { Stack, router, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import Colors from "@/constants/colors";
import { store } from "@/store";
import { useAuth } from "@/context/AuthContext";
import { setLastRoute } from "@/store/appSlice";
import { useAppDispatch } from "@/store/hooks";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = Colors.light;
  const segments = useSegments();
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const currentRoute = `/${segments.join("/")}`;
    dispatch(setLastRoute(currentRoute === "/" ? "/" : currentRoute));

    if (isLoading) {
      return;
    }

    const firstSegment = segments[0];
    const isProtectedRoute = firstSegment === "(app)";
    const isAuthRoute =
      firstSegment === "login" ||
      firstSegment === "signup" ||
      firstSegment === "forgot-password";
    const isIndexRoute = !firstSegment;

    if (!user && isProtectedRoute) {
      router.replace("/login");
      return;
    }

    if (user && (isAuthRoute || isIndexRoute)) {
      router.replace("/(app)/dashboard");
      return;
    }

    if (!user && isIndexRoute) {
      router.replace("/login");
    }
  }, [dispatch, isLoading, segments, user]);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: C.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <AuthProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <KeyboardProvider>
                  <RootLayoutNav />
                </KeyboardProvider>
              </GestureHandlerRootView>
            </AuthProvider>
          </Provider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
