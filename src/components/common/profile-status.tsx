import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useUserData } from "@/hooks/use-user-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useSignOut from "@/hooks/use-sign-out";


export default function ProfileStatus() {
  const { session } = useUserData();
  const user = session?.user;
  const signOut = useSignOut();

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div>
      { !user
        ? //if not log in
          <div className="flex justify-center items-center gap-3">
            <Button 
              variant="outline" 
              className="text-base cursor-pointer border border-gray-400 hover:bg-white hover:underline"
            > 
              <Link to="/sign-in" >
                Sign in
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="text-base cursor-pointer border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
            > 
              <Link to="/sign-up" >
                Create account 
              </Link>
            </Button>
          </div>
        : //if log in
          <div className="flex items-center justify-center gap-5">
            <Button 
              variant="outline" 
              className="text-base cursor-pointer border border-gray-400 hover:bg-white hover:underline"
            > 
              <Link to="/create-post" >
                Create post
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                className="border-none outline-none cursor-pointer"
              >
                 <div className="px-2">
                {
                  user?.image ?
                    <div
                      className="block relative"
                    >
                      <img 
                        src={user?.image} 
                        alt="profile-image" 
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    </div> :
                      <div
                        className="rounded-full w-10 h-10 bg-blue-500 flex items-center justify-center text-white text-xl"
                      >
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                }
              </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-10 min-w-60 p-3">
                <DropdownMenuLabel className="flex flex-col items-start">
                  <span className="text-xl">{user.name}</span>
                  <span className="font-normal">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="flex flex-col gap-1">
                  <DropdownMenuItem 
                    className="text-base cursor-pointer" 
                  >
                    <Link
                      to="/dashboard"
                      className="w-full"
                    >
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-base cursor-pointer" 
                  >
                    <Link
                      to="/create-post"
                      className="w-full"
                    >
                      Create Post
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-base cursor-pointer" 
                  >
                    <Link
                      to="/saved-post"
                      className="w-full"
                    >
                      Saved Post
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-base cursor-pointer" 
                  >
                    <Link
                      to="/settings"
                      className="w-full"
                    >
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-base cursor-pointer" 
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* <Button 
              variant="outline" 
              className="text-base cursor-pointer border border-gray-400 hover:bg-white hover:underline"
            > 
              <Link to="/create-post" >
                Create post
              </Link>
            </Button>
            <div
              className="rounded-full w-10 h-10 bg-blue-500 flex items-center justify-center text-white text-xl"
            > 
              {userName?.charAt(0)} 
            </div> */}
          </div>
      }
    </div>
  )
}