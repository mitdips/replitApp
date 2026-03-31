import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { store } from "@/store";
import {
  removeEmployee,
  setEmployees,
  upsertEmployee,
} from "@/store/employeeSlice";

export type Employee = {
  id: string;
  employeeID: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  department: string;
  status: string;
  isActive: boolean;
  createdAt?: string | null;
};

type EmployeeInput = {
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  isActive?: boolean;
};

type DashboardStats = {
  totalEmployees: number;
  activeEmployees: number;
  recentlyAdded: number;
};

const EMPLOYEES_COLLECTION = "employee_list";

function employeesCollection() {
  return collection(db, EMPLOYEES_COLLECTION);
}

function normalizeTimestamp(value: unknown): string | null {
  if (!value || typeof value !== "object" || !("toDate" in value)) {
    return null;
  }

  try {
    return (value as { toDate: () => Date }).toDate().toISOString();
  } catch {
    return null;
  }
}

function mapEmployee(
  snapshot: { id: string; data: () => Record<string, unknown> },
): Employee {
  const data = snapshot.data();
  const status = typeof data.status === "string" ? data.status : "active";

  return {
    id: snapshot.id,
    employeeID:
      typeof data.employeeID === "string" && data.employeeID.length > 0
        ? data.employeeID
        : `SS-${snapshot.id}`,
    name: typeof data.fullname === "string" ? data.fullname : "",
    email: typeof data.email === "string" ? data.email : "",
    phone: typeof data.phonenumber === "string" ? data.phonenumber : null,
    role: typeof data.role === "string" ? data.role : "Other",
    department: typeof data.department === "string" ? data.department : "",
    status,
    isActive: status.toLowerCase() === "active",
    createdAt: normalizeTimestamp(data.create_time),
  };
}

async function listEmployees() {
  const snapshot = await getDocs(
    query(employeesCollection(), orderBy("create_time", "asc")),
  );
  const employees = snapshot.docs.map(mapEmployee);
  store.dispatch(setEmployees(employees));
  return employees;
}

async function getEmployee(id: string) {
  const snapshot = await getDoc(doc(db, EMPLOYEES_COLLECTION, id));
  if (!snapshot.exists()) {
    throw new Error("Employee not found");
  }

  const employee = mapEmployee(snapshot);
  store.dispatch(upsertEmployee(employee));
  return employee;
}

export function getListEmployeesQueryKey() {
  return ["employees"] as const;
}

export function getGetEmployeeQueryKey(id: string) {
  return ["employees", id] as const;
}

export function getGetDashboardStatsQueryKey() {
  return ["dashboard-stats"] as const;
}

export function useListEmployees() {
  return useQuery({
    queryKey: getListEmployeesQueryKey(),
    queryFn: async () => ({ employees: await listEmployees() }),
  });
}

export function useGetEmployee(id: string) {
  return useQuery({
    queryKey: getGetEmployeeQueryKey(id),
    queryFn: async () => ({ employee: await getEmployee(id) }),
    enabled: !!id,
  });
}

export function useGetDashboardStats() {
  return useQuery({
    queryKey: getGetDashboardStatsQueryKey(),
    queryFn: async (): Promise<DashboardStats> => {
      const employees = await listEmployees();
      const now = Date.now();
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

      return {
        totalEmployees: employees.length,
        activeEmployees: employees.filter((employee) => employee.isActive).length,
        recentlyAdded: employees.filter((employee) => {
          if (!employee.createdAt) {
            return false;
          }

          return new Date(employee.createdAt).getTime() >= sevenDaysAgo;
        }).length,
      };
    },
  });
}

export async function createEmployee(input: EmployeeInput) {
  const employeeDocRef = await addDoc(employeesCollection(), {
    create_time: serverTimestamp(),
    department: input.department?.trim() ?? "",
    email: input.email.trim().toLowerCase(),
    employeeID: "",
    fullname: input.name.trim(),
    phonenumber: input.phone?.trim() ?? "",
    role: input.role,
    status: input.isActive === false ? "inactive" : "active",
  });

  await updateDoc(employeeDocRef, {
    employeeID: `SS-${employeeDocRef.id}`,
  });

  const employee = await getEmployee(employeeDocRef.id);
  store.dispatch(upsertEmployee(employee));
}

export async function updateEmployee(id: string, input: EmployeeInput) {
  await updateDoc(doc(db, EMPLOYEES_COLLECTION, id), {
    department: input.department?.trim() ?? "",
    email: input.email.trim().toLowerCase(),
    fullname: input.name.trim(),
    phonenumber: input.phone?.trim() ?? "",
    role: input.role,
    status: input.isActive === false ? "inactive" : "active",
  });

  const employee = await getEmployee(id);
  store.dispatch(upsertEmployee(employee));
}

export async function deleteEmployee(id: string) {
  await deleteDoc(doc(db, EMPLOYEES_COLLECTION, id));
  store.dispatch(removeEmployee(id));
}
