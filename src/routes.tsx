import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./components/pages/home";
// import RequiredAuth from "./components/common/RequiredAuth";
// import Welcome from "./components/pages/Welcome";
// import PersistLogin from "./components/common/PersistLogin";
import SignUp from "./components/auth/sign-up";
import SignIn from "./components/auth/sign-in";
import Welcome from "./components/pages/welcome";
import PublicRoute from "./components/common/publicRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      { index: true, element: <Home/> },
      { path: "home", element: <Home/> },
      { path: "welcome", element: <Welcome/>}

      // {element: <PersistLogin/>,
      //   children: [
      //     {element: <RequiredAuth />,
      //       children: [
      //         {path: "welcome", element: <Welcome />}
      //       ]
      //     }
      //   ]
      // }
      
    ]
  },
  { element: <PublicRoute/>,
    children: [
      { path: "sign-up", element: <SignUp /> },
      { path: "sign-in", element: <SignIn/> }
    ]
   }
])