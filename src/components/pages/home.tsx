import { useUserData } from "@/hooks/use-user-data"
import { useEffect } from "react"

export default function Home(){
  const {session, error} = useUserData()

  useEffect(() => {
    console.log("USER DATA:", session?.user.name);
    console.log("USER ERROR:", error);
  },[session, error])

  return (
    <div>
      <h1>HELLO {session?.user.name}</h1>
    </div>
  )
}