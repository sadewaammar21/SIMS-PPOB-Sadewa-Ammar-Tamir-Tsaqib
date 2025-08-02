// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { data } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// GET TOKEN HEADER
export const getToken = () => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Features/AuthSlice.js
export const LoginAuth = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${apiUrl}/login`, userData);
      console.log("API Login Response:", response.data); // Tambahkan log ini

      return response.data.data; // Pastikan ini mengandung token & user
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Terjadi kesalahan saat login"
      );
    }
  }
);

// REGISTER
export const RegisterAuth = createAsyncThunk(
  "auth/RegisterUser",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${apiUrl}/registration`, userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || "Registrasi gagal",
      });
    }
  }
);

// LOGOUT
export const Logout = createAsyncThunk("auth/Logout", async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("currentRole");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LoginAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
      })
      .addCase(LoginAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
        state.user = null;
      })
      .addCase(RegisterAuth.fulfilled, (state) => {
        state.isSuccess = true;
        state.message = "Registrasi berhasil";
      })
      .addCase(RegisterAuth.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload.message;
      })
      .addCase(Logout.fulfilled, (state) => {
        state.user = null;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
