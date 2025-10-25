import { Link } from "react-router-dom"
// import { useEffect, useState } from "react"
import ProfileStatus from "./profile-status"

export default function Navbar() {
  // const [isMobile, setIsMobile] = useState(false);
  // const [searchErr, setSearchErr] = useState("");
  
  // useEffect(() => {
  //   const pageSize = () => {
  //     if (window.innerWidth < 768) {
  //       setIsMobile(true)
  //     } else {
  //       setIsMobile(false)
  //     }
  //   }

  //   pageSize();

  //   window.addEventListener("resize",pageSize)

  //   return () => {
  //     window.removeEventListener("resize", pageSize)
  //   }
  // },[]);

  return (
    <div className="bg-white font-sofia-sans">
      {/* render navbar dialog if page size is below 768 */}
      <div className="flex justify-between items-center border-b-1 py-3 px-8">
        <div className="flex items-center justify-center gap-10 outline-none border-none">
          <Link to="/home" className="text-2xl font-extrabold">REPOST</Link>
        </div>

        <ProfileStatus/>
      </div>
    </div>
  )
}