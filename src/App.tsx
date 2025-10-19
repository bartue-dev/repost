import { Outlet } from "react-router-dom"
import Navbar from "./components/common/navbar"

function App() {

  return (
   <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <div>
        <Navbar/>
      </div>

      {/* App child pages */}
      <div className="p-5">
        <Outlet/>
      </div>


   </div>
  )
}

export default App
