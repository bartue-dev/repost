import { Outlet } from "react-router-dom"
import Navbar from "./components/common/navbar"
import { useLocation } from "react-router-dom"
import ScrollToTop from "./components/common/scroll-to-top";

function App() {
  const location = useLocation();

  const pathname = location.pathname.split("/")[1];

  return (
   <div className="flex flex-col min-h-screen bg-gray-100">
      {/* scroll to top when go to other page */}
      <ScrollToTop/>

      {pathname !== "create-post"
        &&//Navbar
          <div>
            <Navbar/>
          </div>
      }

      {/* App child pages */}
      <div className="p-5">
        <Outlet/>
      </div>


   </div>
  )
}

export default App
