import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMutation, useQueryClient } from "@tanstack/react-query"
// import { useUserData } from "@/hooks/use-user-data"
import { Ellipsis } from "lucide-react"
import { axiosPrivate } from "../axios/axios"
import type { ApiErr } from "@/lib/types";


export default function UserPostActions(
  {postId} : { postId: string}
) {
  // const {session} = useUserData();
  // const userId = session?.user.id;
  const queryClient = useQueryClient();

  const {mutate: deleteUserPost} = useMutation({
    mutationFn: async () => {
      const response = axiosPrivate.delete(`/v1/api/post/${postId}`);

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["userPosts"]})
    },
    onError: (error: ApiErr) => 
      console.error(error)
  });

  const handleDeleteUserPost = () => {
    deleteUserPost()
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger 
          asChild
          className="border-none outline-none"
        >
          <button
            className="cursor-pointer hover:bg-gray-100 p-1 rounded-md"
          >
            <Ellipsis
              className="text-gray-600"
            />
          </button>
        </DropdownMenuTrigger>
          <DropdownMenuContent
            className="mr-15"
          >
            <DropdownMenuItem>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteUserPost}
              className="cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

}

