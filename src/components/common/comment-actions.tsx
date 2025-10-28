import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from "lucide-react"
import { useUserData } from "@/hooks/use-user-data";

type CommentActionPropsTypes = {
  commentUserId: string,
  postUserId: string
}

export default function CommentActions({
  commentUserId, 
  postUserId
} : CommentActionPropsTypes) {
  const { session } = useUserData();
  const user = session?.user;

  console.log("USER:", user)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        asChild
        className="border-none outline-none"
      >
        <button
          className="cursor-pointer hover:bg-gray-100 p-1 rounded-md"
        >
          <Ellipsis
            className="text-gray-700"
          />
        </button>
      </DropdownMenuTrigger>
      {
        commentUserId === user?.id ||
        postUserId === user?.id
        ? // if comment author and post user is equal to current user
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
        : // otherwise
        <DropdownMenuContent>
          <DropdownMenuItem>Copy</DropdownMenuItem>
        </DropdownMenuContent>
      }
    </DropdownMenu>
  )
}