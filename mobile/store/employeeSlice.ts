import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Employee } from "@/lib/employees";

type EmployeesState = {
  items: Record<string, Employee>;
  ids: string[];
  lastSyncedAt: string | null;
};

const initialState: EmployeesState = {
  items: {},
  ids: [],
  lastSyncedAt: null,
};

function upsert(state: EmployeesState, employee: Employee) {
  state.items[employee.id] = employee;
  if (!state.ids.includes(employee.id)) {
    state.ids.push(employee.id);
  }
}

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setEmployees(state, action: PayloadAction<Employee[]>) {
      state.items = {};
      state.ids = [];
      action.payload.forEach((employee) => upsert(state, employee));
      state.lastSyncedAt = new Date().toISOString();
    },
    upsertEmployee(state, action: PayloadAction<Employee>) {
      upsert(state, action.payload);
      state.lastSyncedAt = new Date().toISOString();
    },
    removeEmployee(state, action: PayloadAction<string>) {
      delete state.items[action.payload];
      state.ids = state.ids.filter((id) => id !== action.payload);
      state.lastSyncedAt = new Date().toISOString();
    },
    clearEmployees(state) {
      state.items = {};
      state.ids = [];
      state.lastSyncedAt = null;
    },
  },
});

export const { clearEmployees, removeEmployee, setEmployees, upsertEmployee } =
  employeeSlice.actions;
export default employeeSlice.reducer;
