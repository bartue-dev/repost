import { Outlet } from "react-router-dom"
import Navbar from "./components/common/navbar"

function App() {

  return (
   <div className="font-sofia-sans">
      {/* Navbar */}
      <div>
        <Navbar/>
      </div>

      {/* App child pages */}
      <Outlet/>


   </div>
  )
}

export default App
