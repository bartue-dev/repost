import { reactionList } from "@/lib/helper";
import useAddReaction from "@/hooks/use-add-reaction";

export default function Reaction({postId}: {postId: string | undefined}) {
  const addReaction = useAddReaction(postId);

  //reaction click function
  const handleClickReaction = (type : string) => {
    addReaction(type)
  }
  
  return (
    <div 
      className="flex items-center justify-center gap-6 text-2xl bg-white shadow-md border border-gray-100 rounded-md p-3"
    >
      {reactionList.map(reaction => (
        <div key={reaction.type}>
          <input 
            type="text" 
            name={reaction.type}
            value={reaction.emoji}
            className="w-9 outline-none border-none cursor-pointer"
            readOnly
            onClick={() => handleClickReaction(reaction.type)}
          />
        </div>
      ))}
    </div>
  )
}