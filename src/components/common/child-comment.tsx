import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCommentSchema } from "@/lib/zod-schema";
import ChildCommentTextEditor from "./child-comment-text-editor";
import type { ApiErr, ChildCommentPropsType } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosPrivate } from "../axios/axios";
import { LoaderCircle } from "lucide-react";

type ChildCommentData = z.infer<typeof CreateCommentSchema>;

//ChildComment Component
export default function ChildCommentForm({
  setIsReplyBtn,
  commentId,
  postId
}: ChildCommentPropsType) {
  const queryClient = useQueryClient();
  
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ChildCommentData>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      comment: ""
    }
  });

  const {mutate: addChildComment} = useMutation({
    mutationFn: async (data: ChildCommentData) => {
      const response = await axiosPrivate.post(`/v1/api/comment/${commentId}/post/${postId}`, {
        comment: data.comment
      });

      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["post", postId]})
      setIsReplyBtn(undefined)
      reset();
    },
    onError: (error: ApiErr) => {
      console.error("Create child comment error:",error)
    }
  });

  const onSubmit = (data: ChildCommentData) => {
    addChildComment(data)
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="comment"
          control={control}
          render={({field}) => (
            <ChildCommentTextEditor
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {errors.comment && <p className="text-sm text-red-600 mt-2">{errors.comment?.message}</p>}

        <div className="mt-4 space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-sm cursor-pointer hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting
              && 
              <LoaderCircle className="animate-spin text-gray-800"/>
            }
            Submit
          </button>
          <button
            type="button"
            onClick={() => setIsReplyBtn(undefined)}
            className="px-4 py-2 cursor-pointer border rounded-sm border-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}