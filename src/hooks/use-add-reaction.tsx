import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "@/components/axios/axios";
import type { ApiErr } from "@/lib/types";

//add reaction custom hook
export default function useAddReaction(postId: string | undefined) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const {mutate: addReaction} = useMutation({
    mutationFn: async (type : string) => {
      const response = await axiosPrivate.post(`/v1/api/reactions/post/${postId}`, {
        type: type
      })

      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["post", postId]})
    },
    onError: (error: ApiErr) => {
      console.error("Add reaction error:",error)

      if (error.status === 401) {
        navigate("/sign-in", { state: { from: location }, replace: true })
      }
    }
  });

  return addReaction

}