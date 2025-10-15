import { createAuthClient } from "better-auth/react"

//better auth invocation
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BASE_URL,
  fetchOptions: {
    credentials: "include"
  },
})