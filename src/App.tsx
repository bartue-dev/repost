import { Outlet } from "react-router-dom"
import Navbar from "./components/common/navbar"
import { useLocation } from "react-router-dom"

function App() {
  const location = useLocation();

  const pathname = location.pathname.split("/")[1];

  return (
   <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}

      {pathname !== "create-post"
        &&
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
