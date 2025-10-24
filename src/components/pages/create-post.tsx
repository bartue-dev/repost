import TextEditor from "../common/text-editor"
import { useMutation } from "@tanstack/react-query"
import { axiosPrivate } from "../axios/axios"
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePostSchema } from "@/lib/zod-schema";
import { ChevronLeft, LoaderCircle, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

type CreatePostData = z.infer<typeof CreatePostSchema>

export default function CreatePost() {
  const [serverErr, setServerErr] = useState("");
  const [tagValue, setTagValue] = useState("");
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: {errors, isSubmitting}
  } = useForm<CreatePostData>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: []
    }
  });

  //watch tags like a useState
  const tags = watch("tags")

  //addPost query
  const { mutate: addPost } = useMutation({
    mutationFn: async (data: CreatePostData) => {
      const response = await axiosPrivate.post("/v1/api/post", {
        title: data.title,
        content: data.content,
        tags: data.tags
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

  //onSubmit function
  const onSubmit = (data: CreatePostData) => {
    addPost(data);
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

  return (
    <div className="flex justify-center">
      <Link to="/home" >
        <ChevronLeft
          size={40}
          className="text-gray-600"
        />
      </Link>
      <div className="max-w-3xl mx-auto p-6 rounded-xl mt-2 bg-white shadow-md">
        {/* <h1 className="text-2xl font-semibold mb-4">Create New Post</h1> */}

        {serverErr && <p className="text-sm text-red-500 mb-4">{serverErr}</p>}

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
                {tags.length > 0 
                && 
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

              {tags.length < 4
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

            {/* Control the quill text editor using RHF like a state */}
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

            {/* content validation error */}
            {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
          </div>
          
          {/* Publish button */}
          <button
            type="submit"
            className="px-6 py-2 mt-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold cursor-pointer"
            disabled={isSubmitting}
          >
            Publish
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
