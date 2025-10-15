import { Outlet } from "react-router-dom"
import { LoaderCircle } from "lucide-react"
import { useUserData } from "@/hooks/use-user-data";
import { Navigate } from "react-router-dom";

//able to login current user event the page is refresh
export default function ProtectedRoute() {
  const {session, error, isPending} = useUserData();
  const user = session?.user;

  if (isPending) {
    return (
      <div>
        <LoaderCircle className="animate-spin m-auto mt-30"/>
      </div>
    )
  }

  if (error || !user) {
    return <Navigate to="/sign-in" />
  }

  return <Outlet/>
}