import {
  createUserWithEmailAndPassword,
  deleteUser,
  fetchSignInMethodsForEmail,
  updateProfile,
  type UserCredential,
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

export type RegisterAuthInput = {
  email: string;
  password: string;
  displayName: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

export function validatePassword(password: string) {
  return password.trim().length >= 6;
}

export async function checkEmailAvailability(
  email: string,
): Promise<ServiceResult<{ available: boolean }>> {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, normalizeEmail(email));
    return {
      success: true,
      data: {
        available: methods.length === 0,
      },
    };
  } catch (error) {
    console.error("Failed to check email availability", error);
    return {
      success: false,
      error: "Unable to verify email availability.",
      code: "auth/check-email-failed",
    };
  }
}

export async function registerWithEmailPassword(
  input: RegisterAuthInput,
): Promise<ServiceResult<UserCredential>> {
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      normalizeEmail(input.email),
      input.password,
    );

    await updateProfile(credential.user, {
      displayName: input.displayName.trim(),
    });

    return {
      success: true,
      data: credential,
    };
  } catch (error: any) {
    console.error("Failed to register Firebase auth user", error);
    return {
      success: false,
      error: error?.message ?? "Failed to create account.",
      code: error?.code,
    };
  }
}

export async function rollbackAuthUser(): Promise<void> {
  try {
    if (auth.currentUser) {
      await deleteUser(auth.currentUser);
    }
  } catch (error) {
    console.error("Failed to rollback Firebase auth user", error);
  }
}
