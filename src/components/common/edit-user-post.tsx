import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { axiosPrivate } from "../axios/axios"
import { useNavigate, useParams } from "react-router-dom"
import { ChevronLeft, LoaderCircle, X } from "lucide-react";
import { Controller } from "react-hook-form";
import EditUserPostTextEditor from "./edit-user-post-text-editor";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePostSchema } from "@/lib/zod-schema";
import type { ApiErr, UserPostDetailsType } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

type EditUserPostData = z.infer<typeof CreatePostSchema>

export default function EditUserPost() {
  const [tagValue, setTagValue] = useState("")
  const {id} = useParams();
  const navigate = useNavigate();
  const queryClient = new QueryClient();

  //user post details query
  const {
    data: userPostDetails,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["userPostDetails"],
    queryFn: async () : Promise<UserPostDetailsType> => {
      const response = await axiosPrivate.get(`/v1/api/post/${id}`)

      return response.data.data.post
    }
  });

  //zod & useForm
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: {errors, isSubmitting}
  } = useForm<EditUserPostData>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: userPostDetails?.title,
      content: userPostDetails?.content,
      tags: userPostDetails?.tags
    }
  });

  const tags = watch("tags")

  //edit user post mutation query
  const {mutate: editUserPost} = useMutation({
    mutationFn: async (data: EditUserPostData) => {
      const response = await axiosPrivate.put(`/v1/api/post/${id}`, {
        title: data.title,
        content: data.content,
        tags: data.tags
      });

      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["userPostDetails"]});
      toast.success("User post updated successfully")
    },
    onError: (error: ApiErr) => {
      console.error(error)
    }
  });

    //onSubmit function
  const onSubmit = (data: EditUserPostData) => {
    editUserPost(data);
  }

   //Use Enter and Space Key to create tags
  const handleTagsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const tag = tagValue.trim().replace(/[^\w\s]/gi, "").toLowerCase(); //exclude symbols
      if (tag && !tags.includes(tag) && !tag.includes("#")) {
        setValue("tags", [...tags, tag], {shouldValidate: true})
      }
      //clear input
      setTagValue("")
    }
  }

    //Remove tag function
  const handleRemoveTag = (tagToRemove: string) => {
    setValue("tags", tags.filter(tag => tag !== tagToRemove))
  }

  // Reset form when userPostDetails loads
  useEffect(() => {
    if (userPostDetails) {
      reset({
        content: userPostDetails.content,
        title: userPostDetails.title,
        tags: userPostDetails.tags
      });
    }
  }, [userPostDetails, reset]);

  //if user post details query isLoading
 if (isLoading) {
    return (
      <div>
        <LoaderCircle size={60} className="animate-spin mx-auto mt-20"/>
      </div>
    )
  }

  //if user post details error occur
  if (isError) {
    return (
      <div className="w-full h-100 text-center bg-red-600 text-white">
        {error?.message || "Sorry an unexpected error occured!"}
      </div>
    )
  }

  return (
    <div className="flex justify-center items-start">
      <Toaster position="top-right" />
      <button
        onClick={() => navigate(-1)}
        className="cursor-pointer"
      >
        <ChevronLeft
          size={40}
          className="text-gray-600"
        />
      </button>

      <div 
        className="max-w-3xl mx-auto p-6 rounded-xl mt-2 bg-white shadow-md"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="h-115 overflow-auto space-y-4 px-2">
            <div>
              {/* title input */}
              <input
                type="text"
                {...register("title")}
                placeholder="Enter post title"
                className="!text-4xl font-bold py-4 px-2 border-none focus-visible:ring-0 focus-visible:outline-none w-full placeholder:text-4xl placeholder:font-bold"
              />

              {/* title validation error */}
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}

              {/* render the created tags */}
              <div className="flex items-center gap-2 mt-2 mb-2">
                {
                tags &&
                tags.length > 0 && 
                tags.map(tag => (
                  <div 
                    key={tag}
                    className="bg-gray-100 p-2 rounded-md shadow-sm w-fit flex items-center justify-center gap-2"
                  >
                    <div className="text-gray-700"># {tag.replace(/[^\w\s]/gi, "").toLowerCase()}</div>
                    <X
                      size={18}
                      onClick={() => handleRemoveTag(tag)}
                      className="cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              {
              tags 
                &&
                tags.length < 4
                  && //hide tag input if tags is greater than 4
                  <input
                    type="text"
                    placeholder={tags.length > 0 ? "Add more" : "Add atleast four tags.."}
                    className="!text-base py-3 px-2 border-none focus-visible:ring-0 focus-visible:outline-none w-full"
                    value={tagValue}
                    onChange={e => setTagValue(e.target.value)}
                    onKeyDown={handleTagsKeyDown}
                  />
                }

                {/* tags validation error */}
                {errors.tags && <p className="text-sm text-red-500">{errors.tags.message}</p>}

            </div>

            {/* Control the quill text editor using RHF*/}
            <Controller
              name="content"
              control={control}
              render={({field}) => (
                <EditUserPostTextEditor
                  value={field.value} 
                  onChange={field.onChange}
                />
              )}  
            />

            {/* content validation error */}
            {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
          </div>
          
          {/* Publish button */}
          <button
            type="submit"
            className="px-6 py-2 mt-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold cursor-pointer"
            disabled={isSubmitting}
          >
            Save changes
            {isSubmitting 
              && 
              <LoaderCircle
                size={60} 
                className="animate-spin mx-auto mt-10 text-gray-600"
              />
            }
          </button>
        </form>
      </div>
    </div>
  )
}