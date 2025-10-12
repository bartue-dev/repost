import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./components/pages/home";
// import RequiredAuth from "./components/common/RequiredAuth";
// import Welcome from "./components/pages/Welcome";
// import PersistLogin from "./components/common/PersistLogin";
import SignUp from "./components/auth/sign-up";
import SignIn from "./components/auth/sign-in";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {index: true, element: <Home/>},
      {path: "home", element: <Home/>},

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
  { path: "sign-up", element: <SignUp /> },
  { path: "sign-in", element: <SignIn/> }
])