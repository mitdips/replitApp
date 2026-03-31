import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import type { ServiceResult } from "@/lib/authService";

export type UserProfileInput = {
  uid: string;
  email: string;
  displayName: string;
  employeeRole?: string;
  address?: string;
  phoneNumber?: string;
  photoURL?: string;
};

export async function createUserProfile(
  input: UserProfileInput,
): Promise<ServiceResult<{ uid: string }>> {
  try {
    await setDoc(doc(db, "users", input.uid), {
      address: input.address?.trim() ?? "",
      created_time: serverTimestamp(),
      display_name: input.displayName.trim(),
      email: input.email.trim().toLowerCase(),
      employeeRole: input.employeeRole?.trim() ?? "",
      isEmail: true,
      phone_number: input.phoneNumber?.trim() ?? "",
      photo_url: input.photoURL?.trim() ?? "",
      uid: input.uid,
      updateTime: serverTimestamp(),
    });

    return {
      success: true,
      data: { uid: input.uid },
    };
  } catch (error: any) {
    console.error("Failed to create user profile document", error);
    return {
      success: false,
      error: error?.message ?? "Failed to create user profile.",
      code: error?.code,
    };
  }
}

export async function deleteUserProfile(uid: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "users", uid));
  } catch (error) {
    console.error("Failed to delete user profile document", error);
  }
}
