//make sure you're using the react client
import { createAuthClient } from "better-auth/react"
const { useSession } = createAuthClient({
   baseURL: import.meta.env.VITE_BASE_URL,
}) 

export function useUserData() {
    const {
        data: session,
        isPending, //loading state
        error, //error object 
        refetch //refetch the session
    } = useSession()
  
    return {
      session,
      isPending,
      error,
      refetch
    }
}