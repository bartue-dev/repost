import { Button } from "../ui/button"
import useSignOut from "@/hooks/use-sign-out"

export default function Welcome(){
  const signOut = useSignOut();

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div>
      <h1>WELCOME!</h1>
      <Button
        variant="outline"
        onClick={handleSignOut}
      >
        sign out
      </Button>
    </div>
  )
}