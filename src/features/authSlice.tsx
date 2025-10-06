import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type RootState } from "../store";

type InitialStateType = {
  username: string | null
  fullname: string | null, 
  token: string | null
}

type SetCredentialsPayload = {
  username: string,
  fullname: string,
  accessToken: string
}

const initialState: InitialStateType = {
  username: null,
  fullname: null,
  token: null
}

const authSlice = createSlice({
  name: "auth",
  initialState:  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      const { username, fullname, accessToken } = action.payload;
      state.username = username
      state.fullname = fullname;
      state.token = accessToken
    },
    logOut: (state) => {
      state.username = null
      state.fullname = null
      state.token = null
    }
  }
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.fullname;
export const selectCurrentToken = (state: RootState) => state.auth.token;
