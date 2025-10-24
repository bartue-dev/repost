import { useMemo, useState } from "react"
import { Button } from "../ui/button"
import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../axios/axios"
import type { PostsTypes } from "@/lib/types"
import Posts from "../common/posts";

import { Search } from "lucide-react"

export default function Home(){
  const [isSort, setIsSort] = useState(false);
  const [searchPost, setSearchPost] = useState<string[]>([])

  //posts query
  const {
    data: posts,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["posts", searchPost],
    queryFn: async () : Promise<PostsTypes[]> => {
      const response = await axiosInstance.get(`/v1/api/public-data?tags=${searchPost}`);

      return response?.data?.data.posts
    }
  });

  //Search for posts using enkey key event
  const onEnter = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const search = formData.get("search")
      let searchPostsArr: string[] = [];

      if (typeof search === "string") {
        searchPostsArr = search?.split(",").map(s => s.trim()).filter(s => !!s)
      }
     
      setSearchPost(searchPostsArr)
    }
  }

  //create displayPosts and use useMemo to be able to sort the query data
  const displayPosts = useMemo(() => {
    if (!isSort) {
      const oldPosts = posts?.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      });

      return oldPosts
    };

    const latestPosts = posts?.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return latestPosts;
  }, [isSort, posts]);

  return (
    <div className="flex-col md:flex md:flex-row gap-5 py-4 px-10 font-roboto ">
    
      <div className="flex-1 mb-5 md:mb-0">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="px-5 hover:bg-white hover:underline cursor-pointer text-xl !py-5.5 font-sofia-sans"
            onClick={() => setIsSort(prev => !prev)}
          >
            {isSort ? "Old" : "Latest"}
          </Button>

          <form 
            className="flex items-center relative w-full"
            onKeyDown={onEnter}
          >
            <Search 
              size={20}
              className="absolute left-2"
            />
            <input 
              type="text"
              name="search"
              placeholder="Search"
              className="bg-white border-gray-200 text-xl py-2 w-full rounded-md pl-10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:outline-blue-500 focus-visible:shadow-none shadow-sm"
            />
          </form>
        </div>

        {/* contents */}
        <div>
          <Posts
            posts={displayPosts}
            searchPost={searchPost}
            isLoading={isLoading}
            isError={isError}
            errorMessage={error?.message}
          />
        </div>
      </div>

      <div className="text-center border w-full md:w-100">
        <h1>Top discussions</h1>
      </div>
    </div>
  )
}