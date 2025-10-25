import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios/axios";
import { LoaderCircle } from "lucide-react";
import { reactionList } from "@/lib/helper";
import { format, formatDistanceToNow } from "date-fns";
import { HeartPlus, MessageCircle, Bookmark } from "lucide-react";
import type { PostsTypes } from "@/lib/types";
import DOMPurify from "dompurify"


export default function PostDetails() {
  const {postId} = useParams();

  //get specific post
  const {
    data: post,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: async (): Promise<PostsTypes> => {
      const response = await axiosInstance.get(`/v1/api/public-data/${postId}`);

      return response.data.data.post;
    }
  });

  console.log("SPECIFIC POST:", post)

  //post query loading
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

  //if post query error
  if (isError) {
    return (
      <div className="text-center text-sm text-red-600">
        {error.message || "Sorry an unexpected error occur"} 
      </div>
    )
  }

  //sanitized post content
  const sanitizePosts = DOMPurify.sanitize(post?.content ?? "");
  //postDate and time
  const createAt = post?.createdAt ? new Date(post?.createdAt) : new Date(); 
  const formatedDate = format(createAt, "MMM dd")
  const formatedTime = formatDistanceToNow(createAt, { addSuffix: true })


  return(
    <div className="p-5 rounded-md flex">
      <div className="px-15 pt-10 space-y-5 font-roboto">
        <div className="text-center">
          <HeartPlus className="text-gray-800 cursor-pointer"/>
          <span className="text-gray-700 text-sm">{post?.tags.length}</span>
        </div>
        <div className="text-center">
          <MessageCircle className="text-gray-800 cursor-pointer"/>
          <span className="text-gray-700 text-sm">
            {
              post?.comment !== undefined &&
              post?.comment.length +
              post?.comment.reduce((sum, item) => sum + item.childComment.length, 0)
            }
            </span>
        </div>
        <div className="text-center">
          <Bookmark className="text-gray-800 cursor-pointer"/>
          <span className="text-gray-700 text-sm">
            {post?.likedPost.length}
          </span>
        </div>
      </div>

      <div className="space-y-4 bg-white p-5 rounded-md max-w-250">
        <div className="flex items-center justify-start gap-2">
          <div className="rounded-full w-15 h-15 bg-gray-100 flex items-center justify-center text-2xl font-bold font-roboto">
            {post?.user.name.charAt(0)}
          </div>
          <div>
            {/* author name */}
            <h1 className="text-base text-gray-800 font-semibold font-sofia-sans"> {post?.user.name} </h1>
            {/* date publish */}
            <h1 className="text-base text-gray-800 font-sofia-sans"> {formatedDate} ({formatedTime}) </h1>
          </div>
        </div>
        {/* post reactions */}
        <div className="flex items-center gap-5">
          {reactionList.map(list => {
            const reactionExist = post?.reactions.find(reaction => reaction.type === list.type);
            if (!reactionExist) return null

            return (
              <div
                key={list.type}
                className="text-2xl flex items-center justify-center gap-2"
              >
                <div>{list.emoji}</div>
                <div 
                  className="text-gray-700"
                >
                  {post?.reactions.filter(react => react.type === list.type).length}
                </div>
              </div>
            )
          })}
        </div>
        {/* title */}
        <h1 className="text-4xl font-bold font-montserrat break-words">{post?.title}</h1>
        {/* tags */}
        <div className="flex items-center gap-2 text-gray-700">
          {post?.tags.map((tag, i) => (
            <div
              key={i}
            >
              #{tag}
            </div>
          ))}
        </div>
        {/* post content */}
        <div>
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{__html: sanitizePosts}}
          />
        </div>

        {/* comments */}
        <div>
          {post?.comment.map(c => (
            <div key={c.id}>
              {/* parent comment */}
              <div className="flex">
                <div 
                  className="rounded-full w-12 h-12 bg-gray-100 flex items-center justify-center text-xl font-bold font-roboto"
                >
                  {c.user.name.charAt(0)}
                </div>
                <div className="border w-full p-3 rounded-sm">
                  <div className="flex gap-2">
                    <div>{c.user.name}</div>
                    <div>{format(new Date(c.createdAt), "MMM dd")}</div>
                  </div>
                  <div>{c.comment}</div>
                </div>
              </div>
              {/* child comment */}
              <div>
                {c.childComment.map(cc => (
                  <div key={cc.id}>
                    <div>{cc.comment}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  )
}