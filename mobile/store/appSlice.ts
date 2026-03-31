import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AppState = {
  lastRoute: string | null;
};

const initialState: AppState = {
  lastRoute: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLastRoute(state, action: PayloadAction<string | null>) {
      state.lastRoute = action.payload;
    },
  },
});

export const { setLastRoute } = appSlice.actions;
export default appSlice.reducer;
