import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../axios/axios"
import DOMPurify from "dompurify"

type PostsTypes = {
  title: string,
  content: string,
  id: string,
  userId: string
}

export default function Posts() {

  const {
    data: posts,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () : Promise<PostsTypes[]> => {
      const response = await axiosInstance.get("/v1/api/public-post");

      return response?.data?.data.posts
    }
  });

  console.log("POSTS:", posts)

  return (
    <div className="grid grid-cols-1 gap-3 mt-5">
      {posts?.map(post => {
        const sanitizePosts = DOMPurify.sanitize(post.content);

        return (
          <div 
            key={post.id}
            className="border rounded-sm p-5"
          >
            <h2 className="text-2xl">{post.title}</h2>

            <div
              dangerouslySetInnerHTML={{__html: sanitizePosts}}
            >
            </div>
          </div>
        )

      })}
    </div>
    
  )
}