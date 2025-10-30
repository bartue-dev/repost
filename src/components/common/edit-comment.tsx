import EditCommentTextEditor from "./edit-comment-text-editor"
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCommentSchema } from "@/lib/zod-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosPrivate } from "../axios/axios";
import { useNavigate, useParams } from "react-router-dom";
import type { ApiErr } from "@/lib/types";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";

type EditCommentData = z.infer<typeof CreateCommentSchema>

//EditCommentDialog Component
export default function EditComment() {
  const {id} = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: commentDetails,
    isLoading,
    isError,
    error 
  } = useQuery({
    queryKey: ["commentDetails", id],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/v1/api/comment/${id}`);

      return response.data.data;
    }
  });

  const { 
    handleSubmit, 
    reset, 
    control, 
    formState: {errors, isSubmitting}
  } = useForm<EditCommentData>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      comment: ""
    }
  });

  // Reset form when commentDetails loads
  useEffect(() => {
    if (commentDetails?.comment) {
      reset({
        comment: commentDetails.comment
      });
    }
  }, [commentDetails, reset]);

  //edit comment mutation query
  const {mutate: editComment} = useMutation({
    mutationFn: async (data: EditCommentData) => {
      const response = await axiosPrivate.put(`/v1/api/comment/${id}`, {
        comment: data.comment
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["commentDetails", id]});
      navigate(-1)
    },
    onError: (error: ApiErr) => {
      console.error("Edit comment error:",error)
    }
  });

  const onSubmit = (data: EditCommentData) => {
    editComment(data)
  }

  if (isLoading) {
    return (
      <div>
        <LoaderCircle size={60} className="animate-spin mx-auto mt-20"/>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full h-100 text-center bg-red-600 text-white">
        {error?.message || "Sorry an unexpected error occured!"}
      </div>
    )
  }
  
  return (
    <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-250 mx-auto rounded-md space-y-4"
      >
        <Controller 
          name="comment"
          control={control}
          render={({field}) => (
            <EditCommentTextEditor
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {errors.comment && <p className="text-sm text-red-600 ">{errors.comment.message}</p>}

        <div className="space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 cursor-pointer"
            disabled={isSubmitting}
          >
            {
              isSubmitting 
                &&
                <LoaderCircle className="animate-spin text-gray-600"/>
            }
            Submit
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-sm cursor-pointer"
          >
            Cancel
          </button>
  
        </div>
      </form>
  )
}