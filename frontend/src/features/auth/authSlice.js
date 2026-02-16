import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import publicClient from "../../api/publicClient";
import Cookies from "js-cookie";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    const response = await publicClient.post("/login", { email, password });
    Cookies.set("token", response.data.token, { expires: 7 });
    return response.data;
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password, confirmPassword }) => {
    const response = await publicClient.post("/register", {
      name,
      email,
      password,
      password_confirmation: confirmPassword,
    });
    Cookies.set("token", response.data.token, { expires: 7 });
    return response.data;
  },
);

export const getUser = createAsyncThunk("auth/getUser", async () => {
  const response = await privateClient.get("/me");
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: Cookies.get("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      Cookies.remove("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Get User
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        Cookies.remove("token"); // token invalid or expired
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
