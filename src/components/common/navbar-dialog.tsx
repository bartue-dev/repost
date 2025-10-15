import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Menu, Search } from "lucide-react"
import { Input } from "../ui/input"

export default function NavbarDialog() {


  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">
        <Menu />
      </DialogTrigger>
      <DialogContent 
        className="top-0 left-0 translate-x-0 translate-y-0 w-1/2 h-full rounded-none font-sofia-sans"
      >
        <DialogHeader>
          <DialogTitle 
            className="text-2xl font-extrabold mb-4"
          >
            REPOST
          </DialogTitle>
          {/* <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription> */}
          <div className="flex items-center relative">
            <Search 
              size={20}
              className="absolute left-2"
            />
            <Input 
              type="text"
              name="search"
              className="pl-10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:border-black focus-visible:shadow-none"
            />
          </div>
        </DialogHeader>
      </DialogContent>  
    </Dialog>
  )
}