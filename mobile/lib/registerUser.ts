import {
  checkEmailAvailability,
  registerWithEmailPassword,
  rollbackAuthUser,
  validateEmail,
  validatePassword,
  type ServiceResult,
} from "@/lib/authService";
import {
  createEmployeeRecord,
  deleteEmployeeRecord,
} from "@/lib/employeeService";
import { createUserProfile, deleteUserProfile } from "@/lib/userService";

export type RegisterUserInput = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  employeeRole?: string;
  department?: string;
  phoneNumber?: string;
  address?: string;
  photoURL?: string;
  status?: string;
};

export type RegisterUserSuccess = {
  uid: string;
  employeeDocId: string;
  employeeID: string;
};

function validateRegistrationInput(input: RegisterUserInput): string | null {
  if (!input.displayName.trim()) {
    return "Display name is required.";
  }

  if (!validateEmail(input.email)) {
    return "Please enter a valid email address.";
  }

  if (!validatePassword(input.password)) {
    return "Password must be at least 6 characters.";
  }

  if (
    typeof input.confirmPassword === "string" &&
    input.password !== input.confirmPassword
  ) {
    return "Passwords do not match.";
  }

  return null;
}

export async function registerUser(
  input: RegisterUserInput,
): Promise<ServiceResult<RegisterUserSuccess>> {
  const validationError = validateRegistrationInput(input);

  if (validationError) {
    return {
      success: false,
      error: validationError,
      code: "validation/invalid-input",
    };
  }

  const emailAvailability = await checkEmailAvailability(input.email);

  if (!emailAvailability.success) {
    return emailAvailability;
  }

  if (!emailAvailability.data.available) {
    return {
      success: false,
      error: "An account with this email already exists.",
      code: "auth/email-already-in-use",
    };
  }

  const authResult = await registerWithEmailPassword({
    email: input.email,
    password: input.password,
    displayName: input.displayName,
  });

  if (!authResult.success) {
    return authResult;
  }

  const uid = authResult.data.user.uid;
  let employeeDocId: string | null = null;

  try {
    const userProfileResult = await createUserProfile({
      uid,
      email: input.email,
      displayName: input.displayName,
      employeeRole: input.employeeRole,
      address: input.address,
      phoneNumber: input.phoneNumber,
      photoURL: input.photoURL,
    });

    if (!userProfileResult.success) {
      await rollbackAuthUser();
      return userProfileResult;
    }

    const employeeResult = await createEmployeeRecord({
      uid,
      department: input.department,
      email: input.email,
      fullname: input.displayName,
      phonenumber: input.phoneNumber,
      role: input.employeeRole,
      status: input.status,
    });

    if (!employeeResult.success) {
      await deleteUserProfile(uid);
      await rollbackAuthUser();
      return employeeResult;
    }

    employeeDocId = employeeResult.data.documentId;

    return {
      success: true,
      data: {
        uid,
        employeeDocId,
        employeeID: employeeResult.data.employeeID,
      },
    };
  } catch (error: any) {
    console.error("Unexpected error during registration flow", error);
    if (employeeDocId) {
      await deleteEmployeeRecord(employeeDocId);
    }
    await deleteUserProfile(uid);
    await rollbackAuthUser();
    return {
      success: false,
      error: error?.message ?? "Registration failed.",
      code: error?.code ?? "registration/unexpected-error",
    };
  }
}
