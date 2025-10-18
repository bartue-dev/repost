import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import Posts from "../common/posts";

export default function Home(){
  const [onFocus, setOnfocus] = useState(false);

  useEffect(() => {
    console.log(onFocus)
  },[onFocus])

  return (
    <div className="grid grid-cols-[300px_1fr_300px] gap-5 py-4 px-10 font-roboto">
      <div>
        {/* <h1>Home</h1> */}
      </div>

      <div className="">
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
        <Button
          variant="outline"
          className="mt-2 px-5 hover:bg-white hover:underline cursor-pointer"
        >
          Latest
        </Button>

        {/* contents */}
        <div>
          <Posts/>
        </div>
      </div>

      <div className="text-center">
        <h1>Top discussions</h1>
      </div>
    </div>
  )
}