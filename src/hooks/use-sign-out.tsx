import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";

export default function useSignOut() {
  const navigate = useNavigate();

  const signOut = async () => {

    try {
      const response = await authClient.signOut()

      navigate("/sign-in");

      console.log("SIGN OUT:", response)
    } catch (error) {
      console.error(error)
    }
  }


  return signOut;
}