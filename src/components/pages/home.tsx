import { useMemo, useState } from "react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../axios/axios"
import type { PostsTypes } from "@/lib/types"
import Posts from "../common/posts";


export default function Home(){
  const [onFocus, setOnfocus] = useState(false);
  const [isSort, setIsSort] = useState(false);

  const {
    data: posts,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () : Promise<PostsTypes[]> => {
      const response = await axiosInstance.get("/v1/api/public-post");

      return response?.data?.data.posts
    }
  });

  //create displayPosts and use useMemo to be able to sort the query data
  const displayPosts = useMemo(() => {
    if (!isSort) return posts;

    const sortPosts = posts?.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return sortPosts;
  }, [isSort, posts]);

  console.log("POSTS:", displayPosts)

  return (
    <div className="flex gap-5 py-4 px-10 font-roboto">
    
      <div className="flex-1">
        <div className="bg-white p-2 rounded-md shodow-sm">
          <Textarea 
            name="content"
            placeholder="What's in your mind?"
            className={`focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500 bg-white py-3 text-6xl resize-none ${onFocus ? "h-50" : "h-fit"}`}
            onFocus={() => setOnfocus(true)}
            onBlur={() => setOnfocus(false)}
          />
          { onFocus
              &&  
              <div 
                className="text-sm cursor-pointer font-sofia-sans mt-2"
              > 
                <span className="text-gray-600">
                  Unlock the full feature of the editor -
                </span>
                <span className="text-blue-500 hover:underline">
                  {" "}Open Full Editor
                </span>
              </div>
          }
        </div>
          
        <Button
          variant="outline"
          className="mt-4 px-5 hover:bg-white hover:underline cursor-pointer"
          onClick={() => setIsSort(prev => !prev)}
        >
          Latest
        </Button>

        {/* contents */}
        <div>
          <Posts
            posts={displayPosts}
            isLoading={isLoading}
            isError={isError}
            errorMessage={error?.message}
          />
        </div>
      </div>

      <div className="text-center border w-100">
        <h1>Top discussions</h1>
      </div>
    </div>
  )
}