
import { LoaderCircle } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import type { PostsTypes } from "@/lib/types"
// import DOMPurify from "dompurify"

type PostsPropsTypes = {
  posts: PostsTypes[] | undefined,
  isLoading: boolean,
  isError: boolean,
  errorMessage: string | null | undefined,
}

const reactionList = [
  {type: "LOVED", emoji: "❤️", zIndex: 50},
  {type: "LIKED", emoji: "👍", zIndex: 40},
  {type: "COOL", emoji: "😎", zIndex: 30},
  {type: "APPLAUSE", emoji: "👏", zIndex: 20},
]

export default function Posts({
  posts, 
  isLoading, 
  isError, 
  errorMessage
} : PostsPropsTypes) {

  
  if (isLoading) {
    return (
      <div>
        <LoaderCircle
          size={50} 
          className="animate-spin mx-auto mt-10"
        />
      </div>
    )
  }

  if (isError) {
    return (
      <div>
        {errorMessage || "Sorry an unexpected error occured"}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 mt-5">
      {posts?.map(post => {
        // const sanitizePosts = DOMPurify.sanitize(post.content);
        const formatedDate = format(new Date(post.createdAt), "MMM dd")
        const formatedTime = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

        return (
          <div 
            key={post.id}
            className="rounded-sm p-5 bg-white shadow-sm flex flex-col gap-4 group hover:cursor-pointer"
          >
            <div className="flex items-center justify-start gap-2">
              <div
                  className="rounded-full w-12 h-12 bg-gray-100 flex items-center justify-center text-base font-bold"
                > 
                  {post.user.name?.charAt(0)} 
                </div>
              <div>
                <h1 className="text-sm text-gray-800 font-semibold font-sofia-sans">{post.user.name}</h1>
                <div className="text-sm text-gray-800 font-sofia-sans">{formatedDate} ({formatedTime})</div>
              </div>
            </div>

            <h2 
              className="text-2xl break-words ml-10 font-montserrat font-bold text-gray-800 group-hover:text-blue-600"
            >
              {post.title}
            </h2>

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
              <span className="text-sm text-gray-700">{post.reactions.length} reactions</span>
            </div>

            {/* <div
              dangerouslySetInnerHTML={{__html: sanitizePosts}}
            >
            </div> */}
          </div>
        )

      })}
    </div>
    
  )
}