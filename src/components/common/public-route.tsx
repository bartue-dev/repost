import { useUserData } from "@/hooks/use-user-data";
import { Outlet, Navigate } from "react-router-dom";

export default function PublicRoute() {
  const { session } = useUserData();

  if (session?.user) {
    return <Navigate to="/home" replace/>
  }

  return <Outlet/>
}