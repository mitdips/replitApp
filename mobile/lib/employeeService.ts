import {
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import type { ServiceResult } from "@/lib/authService";

export type EmployeeRegistrationInput = {
  uid: string;
  department?: string;
  email: string;
  fullname: string;
  phonenumber?: string;
  role?: string;
  status?: string;
};

export async function createEmployeeRecord(
  input: EmployeeRegistrationInput,
): Promise<ServiceResult<{ documentId: string; employeeID: string }>> {
  try {
    const employeeID = `SS-${input.uid}`;

    await setDoc(doc(db, "employee_list", input.uid), {
      create_time: serverTimestamp(),
      department: input.department?.trim() ?? "",
      email: input.email.trim().toLowerCase(),
      employeeID,
      fullname: input.fullname.trim(),
      phonenumber: input.phonenumber?.trim() ?? "",
      role: input.role?.trim() ?? "",
      status: input.status?.trim() ?? "active",
    });

    return {
      success: true,
      data: {
        documentId: input.uid,
        employeeID,
      },
    };
  } catch (error: any) {
    console.error("Failed to create employee record", error);
    return {
      success: false,
      error: error?.message ?? "Failed to create employee record.",
      code: error?.code,
    };
  }
}

export async function deleteEmployeeRecord(documentId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "employee_list", documentId));
  } catch (error) {
    console.error("Failed to delete employee record", error);
  }
}
