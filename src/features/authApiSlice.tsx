import { apiSlice } from "./api/api";

type LoginCredentials = {
  username: string,
  password: string
}

type LoginResponse = {
  fullname: string,
  accessToken: string
} 

type RefreshResponse = {
  username: string, 
  fullname: string,
  accessToken: string
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: credentials => ({
        url: "/v1/login",
        method: "POST",
        body: {...credentials}
      })
    }),
    refresh: builder.mutation<RefreshResponse, void>({
      query: () => ({
        url: "/v1/refreshToken",
        method: "GET"
      })
    })
  })
})

export const { 
  useLoginMutation,
  useRefreshMutation
} = authApiSlice;