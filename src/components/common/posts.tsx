
import { Bookmark, LoaderCircle } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import type { ApiErr, PostsPropsTypes } from "@/lib/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosPrivate } from "../axios/axios"
import { Link, useNavigate } from "react-router-dom"
import { useUserData } from "@/hooks/use-user-data"
import { reactionList } from "@/lib/helper"
// import DOMPurify from "dompurify"

//Posts component
export default function Posts({
  posts, 
  searchPost,
  isLoading, 
  isError, 
  errorMessage
} : PostsPropsTypes) {
  const navigate = useNavigate();
  const { session } = useUserData();
  const currentUserId = session?.user.id;
  const queryClient = useQueryClient();

  //save liked post
  const {mutate: savedLikedPost} = useMutation({
    mutationFn: async (postId: string) => {
      const response = await axiosPrivate.post(`/v1/api/liked-post/post/${postId}`);

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["posts"]})
    },
    onError: (error: ApiErr) => {
      if (error?.status === 401) {
        navigate("/sign-in")
      }
    }
  })

  //undo save liked post
  const {mutate: undoLikedPost} = useMutation({
    mutationFn: async (postId: string) => {
      const response = await axiosPrivate.delete(`/v1/api/liked-post/post/${postId}`);

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["posts"]})
    },
    onError: (error: ApiErr) => {
      if (error?.status === 401) {
        navigate("/sign-in")
      }
    }
  })

  //if displayPost loading
  if (isLoading) {
    return (
      <div>
        <LoaderCircle
          size={60} 
          className="animate-spin mx-auto mt-10 text-gray-600"
        />
      </div>
    )
  }

  //if displayPost query return error
  if (isError) {
    return (
      <div className="text-center text-sm text-red-600">
        {errorMessage || "Sorry an unexpected error occured"}
      </div>
    )
  }

  //save liked post
  const handleSaveLikedPost = (postId: string) => {
    savedLikedPost(postId)
  }

  //undo save liked post
  const handleUndoLikedPost = (postId: string) => {
    undoLikedPost(postId)
  }

  return (
    <div className="grid grid-cols-1 gap-3 mt-5 overflow-auto">
      {
      posts?.length === 0
      ? //if no post found
        <div>
          <p className="text-center italic">
            Sorry <span className="font-bold">{searchPost.join(" ")}</span> not found
          </p>
        </div>
      : //render posts found
      posts?.map(post => {
        // const sanitizePosts = DOMPurify.sanitize(post.content);
        const formatedDate = format(new Date(post.createdAt), "MMM dd")
        const formatedTime = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

        return (
          <div 
            key={post.id}
            className="rounded-sm p-5 bg-white shadow-sm space-y-4"
          >
            {/* profile information */}
            <div className="flex items-center justify-start gap-2">
              <div
                className="rounded-full w-12 h-12 bg-gray-100 flex items-center justify-center text-base font-bold font-roboto"
              > 
                {post.user.name?.charAt(0)} 
              </div>
              <div>
                <h1 className="text-sm text-gray-800 font-semibold font-sofia-sans">{post.user.name}</h1>
                <div className="text-sm text-gray-800 font-sofia-sans">{formatedDate} ({formatedTime})</div>
              </div>
            </div>

            {/* content container */}
            <div className="flex flex-col justify-between gap-5">
              {/* title */}
              <Link
                to={`/post/post-details/${post.id}`} 
                className="text-2xl break-words ml-10 font-montserrat font-bold text-gray-800 hover:text-blue-600 cursor-pointer"
              >
                {post.title.substring(0, 50)}{post.title.length > 50 && "..."} 
              </Link>

              {/* tags */}
              <div className="flex items-center gap-2 ml-10">
                {post.tags.map(tag => (
                  <div
                    key={tag}
                  >
                    <span className="text-gray-700 text-sm"># {tag}</span>
                  </div>
                ))}
              </div> 

              {/* reactions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-gray-800">
                  <div className="flex ml-10">
                    {reactionList.map(list => {
                      //find the reaction type to sort the rendered emoji base on reactionList order
                      const reactionIsExist = post.reactions.find(reaction => reaction.type === list.type);
                      if (!reactionIsExist) return null;
                      
                      return (
                        <div 
                          role="img"
                          key={list.type}
                          className={`bg-gray-100 flex items-center justify-center w-6 h-6 rounded-full p-4 -mr-4
                            ${list.zIndex === 50 ? "z-50" :
                              list.zIndex === 40 ? "z-40" :
                              list.zIndex === 30 ? "z-30" :
                              list.zIndex === 20 ? "z-20" :
                              ""
                            }`}
                        >
                          {list.emoji}
                        </div>
                      )
                    })}
                  </div>
                  {post.reactions.length > 0 
                    &&
                    <span 
                      className="text-sm text-gray-700"
                    >
                      {post.reactions.length} reactions
                    </span>
                  }
                    
                </div>

                <Bookmark
                  fill={post?.likedPost.find(user => user.userId === currentUserId) ? "black" : "none"} 
                  className="cursor-pointer"
                  onClick={() => {
                    if (post?.likedPost.find(user => user.userId === currentUserId)) {
                      handleUndoLikedPost(post.id)
                    } else {
                      handleSaveLikedPost(post.id)
                    }
                  }}
                />
              </div>
            </div>

            {/* <div
              className="ql-editor"
              dangerouslySetInnerHTML={{__html: sanitizePosts}}
            >
            </div> */}
          </div>
        )})}
    </div>
    
  )
}