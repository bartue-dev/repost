import { Button } from "../ui/button"
import useSignOut from "@/hooks/use-sign-out"
import { useUserData } from "@/hooks/use-user-data";

export default function Welcome(){
  const signOut = useSignOut();
  const {session} = useUserData();
  const user = session?.user;

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div>
      <h1>WELCOME! {user?.name} </h1>
      <Button
        variant="outline"
        onClick={handleSignOut}
      >
        sign out
      </Button>
    </div>
  )
}