import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";
import { useUserData } from "./use-user-data";

export default function useSignOut() {
  const navigate = useNavigate();
  const { refetch } = useUserData();

  const signOut = async () => {

    try {
      await authClient.signOut()

      refetch();
      navigate("/sign-in");
    } catch (error) {
      console.error(error)
    }
  }


  return signOut;
}