import { axiosPrivate } from "@/components/axios/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { ApiErr } from "@/lib/types";


export default function useSavedLikedPost() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  //save liked post
    const {mutate: savedLikedPost} = useMutation({
      mutationFn: async (postId: string | undefined) => {
        const response = await axiosPrivate.post(`/v1/api/liked-post/post/${postId}`);
  
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
    });

    return savedLikedPost
}