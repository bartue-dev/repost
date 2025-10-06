import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../features/hooks";
import { selectCurrentToken } from "../../features/authSlice";

export default function RequiredAuth() {
  const token = useAppSelector(selectCurrentToken)
  const location = useLocation();

  return(
    token
      ? <Outlet/>   
      : <Navigate to="/login" state={{from: location}} replace />
  ) 
}