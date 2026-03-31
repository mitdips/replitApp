declare module "@firebase/auth/dist/rn/index.js" {
  export * from "@firebase/auth";
  import type AsyncStorage from "@react-native-async-storage/async-storage";
  import type { Persistence } from "firebase/auth";

  export function getReactNativePersistence(
    storage: typeof AsyncStorage,
  ): Persistence;
}
