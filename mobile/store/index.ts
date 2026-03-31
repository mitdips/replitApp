import { configureStore } from "@reduxjs/toolkit";
import appReducer from "@/store/appSlice";
import authReducer from "@/store/authSlice";
import employeeReducer from "@/store/employeeSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    employees: employeeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
