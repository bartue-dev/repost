// import { Outlet } from "react-router-dom"
// import { useState, useEffect } from "react"
// import { useAppSelector, useAppDispatch } from "../../features/hooks"
// import { setCredentials, selectCurrentToken } from "../../features/auth/authSlice"
// import { useRefreshMutation } from "../../features/auth/authApiSlice"
// import { LoaderCircle } from "lucide-react"

// //able to login current user event the page is refresh
// export default function PersistLogin() {
//   const [isLoading, setIsLoading] = useState(true);
//   const token = useAppSelector(selectCurrentToken);
//   const dispatch = useAppDispatch();

//   const [refresh] = useRefreshMutation();

//   useEffect(() => {
//     let isMounted = true;

//     const verifyRefreshToken = async () => {
//       try {
//         //get the refresh token from the backend api
//         const refreshData = await refresh().unwrap();

//         //set the new credentials data from the refreshtoken response
//         dispatch(setCredentials({
//           username: refreshData.username,
//           fullname: refreshData.fullname,
//           accessToken: refreshData.accessToken
//         }));

//       } catch (error) {
//         console.error(error)
//       } finally {
//         if (isMounted) {
//           setIsLoading(false)
//         }
//       }
//     }

//     if (!token) {
//       verifyRefreshToken()
//     } else {
//       setIsLoading(false)
//     }

//     return () => {
//       isMounted = false
//     }

//   },[refresh, token, dispatch])

//   return (
//     <div>
//       { isLoading
//         ? <LoaderCircle/>
//         : <Outlet/>}
//     </div>
//   )
// }