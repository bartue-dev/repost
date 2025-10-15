import { Search } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"
import ProfileStatus from "./profile-status"
import { useEffect, useState } from "react"
import NavbarDialog from "./navbar-dialog";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const pageSize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true)
        console.log("Page size is below 768", window.innerWidth)
      } else {
        setIsMobile(false)
        console.log("Page size is above 768", window.innerWidth)
      }
    }

    pageSize();

    window.addEventListener("resize",pageSize)

    return () => {
      window.removeEventListener("resize", pageSize)
    }
  },[])


  return (
    <div>
      {/* render navbar dialog if page size is below 768 */}
      { isMobile
        ? 
          <div className="flex justify-between items-center border-b-1 py-3 px-8">
            <NavbarDialog/>
            <Button 
              variant="outline" 
              className="text-base cursor-pointer border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
            > 
              <Link to="/sign-up" >
                Create account 
              </Link>
            </Button>
          </div>
        : 
        <div className="flex justify-between items-center border-b-1 py-3 px-8">
          <div className="flex items-center justify-center gap-10">
            <h1 className="text-2xl font-extrabold">REPOST</h1>
            <div className="flex items-center relative">
              <Search 
                size={20}
                className="absolute left-2"
              />
              <Input 
                type="text"
                name="search"
                className="w-120 pl-10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:border-black focus-visible:shadow-none"
              />
            </div>
          </div>

          <ProfileStatus/>
        </div>
          
      }

 

    </div>
  )
}