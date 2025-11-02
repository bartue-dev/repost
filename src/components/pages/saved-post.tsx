import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosPrivate } from "../axios/axios"
import { DeleteIcon, IterationCcw, LoaderCircle } from "lucide-react";
import { format } from "date-fns";
import type { ApiErr, SavedPostType } from "@/lib/types";
import { Link } from "react-router-dom";

export default function SavedPost() {
  const queryClient = useQueryClient();

  const {
    data: savedPost,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["savedPost"],
    queryFn: async () : Promise<SavedPostType[]> => {
      const response = await axiosPrivate.get("/v1/api/liked-post");

      return response.data.data.allLikedPost
    }
  });

  const {mutate: deleteSavedPost} = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosPrivate.delete(`/v1/api/liked-post/${id}`)

      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["savedPost"]})
    },
    onError: (error: ApiErr) => {
      console.error(error)
    }
  });

  const handleDeleteSavedPost = (id: string) => {
    deleteSavedPost(id)
  }

   //if user saved post query isLoading
   if (isLoading) {
      return (
        <div>
          <LoaderCircle size={60} className="animate-spin mx-auto mt-20"/>
        </div>
      )
    }
  
    //if user saved post error occur
    if (isError) {
      return (
        <div className="w-full h-100 text-center bg-red-600 text-white">
          {error?.message || "Sorry an unexpected error occured!"}
        </div>
      )
    }

    console.log(savedPost)

  return (
    <div className="px-4">
      <h1 
        className="font-montserrat text-2xl font-semibold mb-4"
      >
        Saved Post List ({savedPost?.length}) 
      </h1>

      <div className="bg-white space-y-4 p-4 rounded-md w-200">
        {
        savedPost &&
        savedPost?.length > 0 ?
        savedPost?.map(sp => (
          <div
            key={sp.id}
            className="flex items-center gap-2 relative border-b-1 pb-3"
          >
            <div 
              className="rounded-full w-12 h-12 bg-gray-100 flex items-center justify-center text-base font-bold font-roboto"
            >
              {sp.post.user.name.charAt(0).toUpperCase()}
            </div>

            <div className="">
              <h1 className="font-montserrat font-semibold">{sp.post.title}</h1>
              <div className="flex items-center gap-2 font-sofia-sans">
                <div>{sp.post.user.name} |</div>
                <div>{format(new Date(sp.post.createdAt), "MMM dd")}</div>
              </div>
            </div>

            <div
              className="absolute right-10 font-roboto space-x-4"
            >
              <button
                className="cursor-pointer hover:underline hover:text-blue-600"
              >
                <Link
                  to={`/post/post-details/${sp.post.id}`}
                >
                  <IterationCcw
                    size={22}
                  />
                </Link>
              </button>

               <button
                onClick={() => handleDeleteSavedPost(sp.id)}
                className="cursor-pointer hover:underline hover:text-red-600"
              >
                <DeleteIcon/>
              </button>
            </div>
          </div>
        )) :
        <div className="text-center italic font-roboto">
          <h1>No post has been saved yet</h1>
        </div>
      }
      </div>

    </div>
  )
}