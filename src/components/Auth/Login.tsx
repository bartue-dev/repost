import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"

import { useAppDispatch } from "../../features/hooks"
import { setCredentials } from "../../features/authSlice"
import { useLoginMutation } from "../../features/authApiSlice"

type ApiError = {
  status: number,
}

type ErrorTypes = {
  username?: string,
  password?: string,
  server?: string
} | string

export default function Login() {
  const [error, setError] = useState<ErrorTypes>({});
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {

      const inputErr: ErrorTypes = {}

      const formData = new FormData(e.currentTarget);

      const username = formData.get("username") as string;
      const password = formData.get("password") as string;

      if (username.length <= 0) {
        inputErr.username = "Username must not be empty";
      }

      if (password.length <= 0) {
        inputErr.password = "Password must not be empty";
      }

      if (Object.keys(inputErr).length > 0) {
        setError(inputErr)
        return;
      }

      const userData = await login({ username, password}).unwrap();

      const fullname: string = userData.fullname;
      const accessToken: string = userData.accessToken;

      dispatch(setCredentials({username, fullname, accessToken}));

      console.log("USER DATA:", userData)

      navigate("/welcome")
    } catch (err) {
      console.error(err)

      const error = err as ApiError
      const serverError: ErrorTypes = {}

      if (!error?.status) {
        serverError.server = "No server response";
      } else if (error.status === 400) {
        serverError.server = "Incorrect username or password";
      } else if (error.status === 401) {
        serverError.server = "Unauthorized";
      } else {
        serverError.server = "Login Failed";
      }

      if (Object.keys(serverError).length > 0) {
        setError(serverError)
        return
      }
    }
  }

  return (
    <div className="border border-gray-400 m-auto mt-15 w-80 p-10 rounded-md ">
      {typeof error === "object" && error?.server && <p className="text-sm text-red-500">{error.server}</p>}
      <form 
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"  
      >
        <div className="flex flex-col justify-center gap-1">
          <label htmlFor="username">Username </label>
          <input 
            type="text" 
            name="username" 
            id="username"
            className="input input-sm"
            />
          {typeof error === "object" && error?.username && <p className="text-sm text-red-500">{error?.username}</p>}
        </div>

        <div className="flex flex-col justify-center gap-1">
          <label htmlFor="password">Password </label>
          <input 
            type="password" 
            name="password" 
            id="password"
            className="input input-sm"
            />
          {typeof error === "object" && error?.password && <p className="text-sm text-red-500">{error?.password}</p>}
        </div>
      
        <button 
          type="submit"
          className="place-self-start btn btn-primary w-30"
          disabled={isLoading ? true : false}
        >
          { isLoading && <span className="loading loading-spinner text-neutral"></span> }
          Submit
        </button>
      </form>
    </div>
  )
}