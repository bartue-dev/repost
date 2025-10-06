import { useAppSelector } from "../../features/hooks"
import { selectCurrentUser, selectCurrentToken } from "../../features/authSlice"

export default function Welcome(){
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectCurrentToken);

  return (
    <div>
      <h1>HELLO {user}</h1>
      <h1>TOKEN: {token}</h1>
    </div>
  )
}