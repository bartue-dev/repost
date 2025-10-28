import { Outlet, useLocation } from "react-router-dom"
import { LoaderCircle } from "lucide-react"
import { useUserData } from "@/hooks/use-user-data";
import { Navigate } from "react-router-dom";

//able to login current user event the page is refresh
export default function ProtectedRoute() {
  const {session, error, isPending} = useUserData();
  const user = session?.user;
  const location = useLocation();

  if (isPending) {
    return (
      <div>
        <LoaderCircle
          size={60} 
          className="animate-spin mx-auto mt-10 text-gray-600"
        />
      </div>
    )
  }

  if (error || !user) {
    return <Navigate to="/sign-in" state={{ from: location}} replace/>
  }

  return <Outlet/>
}