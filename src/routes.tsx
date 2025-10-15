import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./components/pages/home";
import ProtectedRoute from "./components/common/protected-route";
import SignUp from "./components/auth/sign-up";
import SignIn from "./components/auth/sign-in";
import Welcome from "./components/pages/welcome";
import PublicRoute from "./components/common/public-route";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      { index: true, element: <Home/> },
      { path: "home", element: <Home/> },

      {element: <ProtectedRoute />,
        children: [
          { index: true, element: <Welcome /> },
          { path: "welcome", element: <Welcome /> }
        ]
      }  
    ]
  },
  { element: <PublicRoute/>,
    children: [
      { path: "sign-up", element: <SignUp /> },
      { path: "sign-in", element: <SignIn/> }
    ]
   }
])