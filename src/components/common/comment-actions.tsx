import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from "lucide-react"
import { useUserData } from "@/hooks/use-user-data";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosPrivate } from "../axios/axios";
import type { ApiErr } from "@/lib/types";

type CommentActionPropsTypes = {
  commentUserId: string,
  postUserId: string,
  commentId: string,
  postId: string
}

//CommentActions component
export default function CommentActions({
  commentUserId, 
  postUserId,
  commentId,
  postId
} : CommentActionPropsTypes) {
  const { session } = useUserData();
  const user = session?.user;
  const queryClient = useQueryClient();

  const {
    mutate: deleteComment
  } = useMutation({
    mutationFn: async () => {
      const response = await axiosPrivate.delete(`/v1/api/comment/${commentId}`)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["post", postId]})
    },
    onError: (error: ApiErr) => {
      console.error("Delet comment error:", error)
    }
  });

  const handleDeleteComment = () => {
    deleteComment();
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
              className="text-gray-700"
            />
          </button>
        </DropdownMenuTrigger>
        {
          commentUserId === user?.id ||
          postUserId === user?.id
          ? // if comment author and post author is equal to current user
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link to={`/edit-comment/${commentId}/`} >
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteComment}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
          : // otherwise render a copy only option
          <DropdownMenuContent>
            <DropdownMenuItem>Copy</DropdownMenuItem>
          </DropdownMenuContent>
        }
      </DropdownMenu>
    </div>
  )
}