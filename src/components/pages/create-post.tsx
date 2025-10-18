import TextEditor from "../common/text-editor"
import { useMutation } from "@tanstack/react-query"
import { axiosPrivate } from "../axios/axios"
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePostSchema } from "@/lib/zod-schema";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";

type CreatePostData = z.infer<typeof CreatePostSchema>

export default function CreatePost() {
  const [serverErr, setServerErr] = useState("")
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: {errors, isSubmitting}
  } = useForm<CreatePostData>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: "",
      content: ""
    }
  });

  const {
    mutate: addPost
  } = useMutation({
    mutationFn: async (data: CreatePostData) => {
      const response = await axiosPrivate.post("/v1/api/post", {
        title: data.title,
        content: data.content
      });

      return response;
    },
    onSuccess: (response) => {
      console.log("Added post", response)
      reset()
    },
    onError: (error) => {
      console.error("Axios error:",error)

      if (error.message === "Network Error") {
        setServerErr("Unexpected error: Check your network")
      }
    }
  })

  const onSubmit = (data: CreatePostData) => {
    addPost(data);
  }

  return (
    <div className="max-w-3xl p-6 border rounded-xl">
      <h1 className="text-2xl font-semibold mb-4">Create New Post</h1>

      {serverErr && <p className="text-sm text-red-500 mb-4">{serverErr}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="text"
          {...register("title")}
          placeholder="Enter post title"
          className="!text-base py-6 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:border-black focus-visible:shadow-none"
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}

        <Controller
          name="content"
          control={control}
          render={({field}) => (
            <TextEditor 
              value={field.value} 
              onChange={field.onChange}
            />
          )}  
        />
        
        {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          disabled={isSubmitting}
        >
          Publish
          {isSubmitting && <LoaderCircle className="animate-spin"/>}
        </button>
      </form>
    </div>
  )
}
