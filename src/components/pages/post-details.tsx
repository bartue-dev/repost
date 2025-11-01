import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios/axios";
import { Heart, LoaderCircle, MessageCircle, Bookmark } from "lucide-react";
import { reactionList } from "@/lib/helper";
import { format, formatDistanceToNow } from "date-fns";
import { useRef, useEffect, useState } from "react";
import type { PostsTypes } from "@/lib/types";
import DOMPurify from "dompurify"
import Comments from "../common/comments";
import Reaction from "../common/reaction";
import useAddReaction from "@/hooks/use-add-reaction";
import { useUserData } from "@/hooks/use-user-data";
import useSavedLikedPost from "@/hooks/use-save-liked-post";
import useUndoLikedPost from "@/hooks/use-undo-liked-post";

//Post Details Component
export default function PostDetails() {
  const isBottomRef = useRef<HTMLDivElement>(null)
  const isCommentRef = useRef<HTMLDivElement>(null)
  const [reactionEnter, setReactionEnter] = useState(false)
  const [isCommentAdded, setIsCommentAdded] = useState(false)
  const {postId} = useParams();
  const {session} = useUserData();
  const currentUserId = session?.user.id;
  const addReaction = useAddReaction(postId);
  const savedLikedPost = useSavedLikedPost();
  const undoLikedPost = useUndoLikedPost();

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


  const handleSaveLikedPost = () => {
    savedLikedPost(post?.id)
  }

  const handleUndoLikedPost = () => {
    undoLikedPost(post?.id)
  }

  useEffect(() => {
    if (isBottomRef.current && isCommentAdded) {
      isBottomRef.current?.scrollIntoView({behavior: "smooth"})
      setIsCommentAdded(false)
    }
  },[isCommentAdded]);

  //setReactionEnter to false when click anywhere on the page
  useEffect(() => {

    const handleClick = () => {
      setReactionEnter(false)
    }
    
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick)
    }

  },[])

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
      {/* left icons */}
      <div className="px-15 pt-10 space-y-5 font-roboto">
        <div className="text-center relative">
          <Heart
            onMouseEnter={() => setReactionEnter(true)}
            onClick={() => addReaction("LOVED")}
            fill={
              post?.reactions && post?.reactions.length > 0 ? 
              "red" : 
              "none"
            }
            className={`cursor-pointer hover:text-red-500 ${
              post?.reactions && post?.reactions.length > 0 ? 
              "text-red-500" : 
              "text-gray-800"
            }`}
          />
          <span className="text-gray-700 text-sm">{post?.reactions.length}</span>
            {
              reactionEnter
              &&
              <div className="absolute -top-3 left-10">
                <Reaction
                  postId={postId}
                />
              </div>
            }
        </div>
        <div className="text-center">
          <MessageCircle 
            onClick={() => isCommentRef.current?.scrollIntoView({behavior: "smooth"})}
            className="text-gray-800 cursor-pointer"
          />
          <span className="text-gray-700 text-sm">
            {
              post?.comment !== undefined &&
              post?.comment.length +
              post?.comment.reduce((sum, item) => sum + item.childComment.length, 0)
            }
            </span>
        </div>
        <div className="text-center">
          <Bookmark
            fill={
              post?.likedPost.find(user => user.userId === currentUserId) ? 
              "black" : 
              "none"
            } 
            onClick={() => {
              if (post?.likedPost.find(post => post.userId === currentUserId)) {
                handleUndoLikedPost()
              } else {
                handleSaveLikedPost()
              }
            }}
            className="text-gray-800 cursor-pointer"
          />
          <span className="text-gray-700 text-sm">
            {post?.likedPost.length}
          </span>
        </div>
      </div>
      
      {/* post content details */}
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

        {/* separator */}
        <hr/>
        {/* comments */}
        <div ref={isCommentRef}>
          <Comments
            post={post}
            setIsCommentAdded={setIsCommentAdded}
          />
        </div>
      <div ref={isBottomRef} ></div> 
      </div>

    </div>
  )
}