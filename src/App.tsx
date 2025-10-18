import { Outlet } from "react-router-dom"
import Navbar from "./components/common/navbar"

function App() {

  return (
   <div className="h-screen">
      {/* Navbar */}
      <div>
        <Navbar/>
      </div>

      {/* App child pages */}
      <div className="p-5 ">
        <Outlet/>
      </div>


   </div>
  )
}

export default App
