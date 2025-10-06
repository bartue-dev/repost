import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../authSlice";
import { type RootState } from "../../store";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }

    return headers
  }
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  console.log("REAUTH",result)

  if (result?.error?.status === 403) {
    console.log("sending refresh token")
    //send refresh token to get new access token
    const refreshResult = await baseQuery("/v1/refreshToken", api, extraOptions)
    console.log(refreshResult)

    if (refreshResult?.data) {
      const refreshData = refreshResult.data as {
        username: string,
        fullname: string,
        accessToken: string
      }
      //store the new token
      api.dispatch(setCredentials({
        username: refreshData.username,
        fullname: refreshData.fullname,
        accessToken: refreshData.accessToken
      }));

      //retry the original query with new access token
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logOut())
    }
  }

  return result;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: builder => ({})
})
