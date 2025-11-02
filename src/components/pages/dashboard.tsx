import { useQuery } from "@tanstack/react-query"
import { axiosPrivate } from "../axios/axios";
import { LoaderCircle } from "lucide-react";
import { format } from "date-fns";
import type { PostsTypes } from "@/lib/types";
import UserPostActions from "../common/user-posts-actions";
import { Link } from "react-router-dom";

export default function Dashboard() {

  //userPosts query
  const {
    data: userPosts,
    isLoading: userPostsIsLoading,
    isError: userPostsIsError,
    error: userPostsError
  } = useQuery({
    queryKey: ["userPosts"],
    queryFn: async () : Promise<PostsTypes[]> => {
      const response = await axiosPrivate.get(`/v1/api/post`);

      return response?.data?.data.posts
    }
  });

  
  //user posts total reactions
  const totalPostReactions = userPosts?.map(posts => posts.reactions.length)
    .reduce((acc, value) => acc + value, 0);

  //user posts total comments
  const totalPostComments = userPosts?.map(posts => posts.comment.length)
    .reduce((acc, value) => acc + value, 0);

  //user total posts
  const totalPosts = userPosts?.length

    //if displayPost loading
  if (userPostsIsLoading) {
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
  if (userPostsIsError) {
    return (
      <div className="text-center text-sm text-red-600">
        {userPostsError.message || "Sorry an unexpected error occured"}
      </div>
    )
  }

  console.log("USER POSTS:", userPosts);


  return (
    <div className="px-4">
      <h1 className="text-2xl font-semibold font-montserrat mb-5">DASHBOARD</h1>
      {/* Data summary */}
      <div className="flex justify-between items-center gap-5">
        <div
          className="bg-white p-6 flex flex-col gap-2 rounded-md w-full"
        >
          <span className="text-3xl font-semibold">{totalPostReactions}</span>  
          <span className="text-xl font-sofia-sans font-light">Total post reactions</span>
        </div>
        <div
          className="bg-white p-6 flex flex-col gap-2 rounded-md w-full"
        >
          <span className="text-3xl font-semibold">{totalPostComments}</span>
          <span className="text-xl font-sofia-sans font-light">Total post comments</span>
        </div>
        <div
          className="bg-white p-6 flex flex-col gap-2 rounded-md w-full"
        >
          <span className="text-3xl font-semibold">{totalPosts}</span>
          <span className="text-xl font-sofia-sans font-light">Total posts</span>
        </div>
      </div>

      {/* list of posts container*/}
      <div className="mt-5">
        <h1 className="font-semibold font-montserrat text-2xl mb-5">Posts</h1>
        {/* list of posts */}
        <div className="space-y-3">
          {userPosts?.map(post => (
            <div 
              key={post.id}
              className="bg-white p-4 rounded-md border relative pr-15"
            >
              <Link
                to={`/post/post-details/${post.id}`}
                className="text-xl font-montserrat font-bold hover:text-blue-600 cursor-pointer break-words"
              >
                {post.title}
              </Link>
              <div className="space-x-2 font-roboto text-sm">
                <span className="font-sofia-sans">Published:</span>
                <span>{format(new Date(post.createdAt), "MMM dd")}</span>
              </div>
              <div className="absolute top-2 right-3">
                <UserPostActions
                  postId={post.id}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}