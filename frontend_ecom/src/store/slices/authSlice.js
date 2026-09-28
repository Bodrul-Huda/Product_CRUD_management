import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;

      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const { setCredentials, clearCredentials, clearAuthError } =
  authSlice.actions;

export default authSlice.reducer;
