import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "@/components/axios/axios";
import type { ApiErr } from "@/lib/types";


export default function useUndoLikedPost() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  //undo save liked post
  const {mutate: undoLikedPost} = useMutation({
    mutationFn: async (postId: string | undefined) => {
      const response = await axiosPrivate.delete(`/v1/api/liked-post/post/${postId}`);

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["posts"]})
      queryClient.invalidateQueries({queryKey: ["post"]})
    },
    onError: (error: ApiErr) => {
      if (error?.status === 401) {
        navigate("/sign-in")
      }
    }
  })

  return undoLikedPost
}