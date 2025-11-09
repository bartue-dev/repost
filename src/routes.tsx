import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./components/pages/home";
import ProtectedRoute from "./components/common/protected-route";
import SignUp from "./components/auth/sign-up";
import SignIn from "./components/auth/sign-in";
import PublicRoute from "./components/common/public-route";
import NotFound from "./components/common/not-found";
import CreatePost from "./components/pages/create-post";
import PostDetails from "./components/pages/post-details";
import EditComment from "./components/common/edit-comment";
import Dashboard from "./components/pages/dashboard";
import EditUserPost from "./components/common/edit-user-post";
import SavedPost from "./components/pages/saved-post";
import Settings from "./components/pages/settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <NotFound/>,
    children: [
      { index: true, element: <Home/> },
      { path: "home", element: <Home/> },
      { path: "post/post-details/:postId", element: <PostDetails/>},


      {element: <ProtectedRoute />,
        children: [
          { path: "create-post", element: <CreatePost/> },
          { path: "edit-comment/:id", element: <EditComment/> },
          { path: "dashboard", element: <Dashboard/> },
          { path: "edit-user-post/:id", element: <EditUserPost/> },
          { path: "saved-post", element: <SavedPost/> },
          { path: "settings", element: <Settings/> },
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