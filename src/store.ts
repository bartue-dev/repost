import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/api";
import authReducer from "./features/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer
  },
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true // set to false in production
}); 

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;