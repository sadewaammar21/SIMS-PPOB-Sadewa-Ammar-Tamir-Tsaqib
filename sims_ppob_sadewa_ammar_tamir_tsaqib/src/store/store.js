import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/AuthSlice"; // Path yang sesuai ke AuthSlice.js

const store = configureStore({
  reducer: {
    auth: authReducer, // Menggunakan authSlice.reducer yang diekspor default
  },
});

export default store;
