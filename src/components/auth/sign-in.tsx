import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { z } from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/lib/zod-schema";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { LoaderCircle } from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import type { ApiErr } from "@/lib/types";

type SignInData = z.infer<typeof SignInSchema>

export default function SignIn() {
  const [serverErr, setServerErr] = useState<{error?: string}>({});
  const navigate = useNavigate();
  const {refetch} = useUserData();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SignInData>({
    resolver: zodResolver(SignInSchema)
  });

  const {
    mutate: signIn
  } = useMutation({
    mutationFn: async (data: SignInData) => {
      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password
      });

      if (response.error) {
        throw response.error;
      }

      return response;
    },
    onSuccess: async (response) => {
      console.log("Sign in", response)

      refetch();
      navigate("/home")

      reset();
    },
    onError: (error: ApiErr) => {
      console.error(error);
      reset();

      /* serverErrors */
      const validateServer = {} as {error:string | undefined}

      if (!error?.status) {
        //if server is not running
        validateServer.error = "No server response"
      } else if (error?.status === 400) {
        //if status is equal to 400
        validateServer.error = error?.response?.data?.message
      } else if (error?.status === 401) {
        //if status is equal to 400
        validateServer.error = error?.message
      } else {
        //if none of the if statements but also failed
        validateServer.error = "Login failed"
      }

      //if validateServer object is not empty set the serverError state
      if (Object.keys(validateServer).length > 0) {
        setServerErr(validateServer)
      }
    }
  })

  const onSubmit = (data: SignInData) => {
    signIn(data)
  }


  return (
    <div className="border-1 w-80 place-self-center p-5 mt-10 rounded-md font-sofia-sans">
      <h1 className="text-2xl text-center">Sign in to repost</h1>
      {serverErr?.error && <p className="text-sm text-red-600 text-center mt-4">{serverErr.error}</p>}
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 mt-5"  
      >
        <div>
          <label htmlFor="email">Email</label>
          <Input 
            type="email" 
            id="email"
            {...register("email")}
            className="focus-visible:ring-1 focus-visible:ring-offset-0"
          />
          {errors?.email && <p className="text-sm text-red-600">{errors?.email?.message}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <Input 
            type="password" 
            id="password"
            {...register("password")}
            className="focus-visible:ring-1 focus-visible:ring-offset-0"
          />
          {errors?.password && <p className="text-sm text-red-600">{errors?.password?.message}</p>}
        </div>

        <Button
          variant="outline"
          type="submit"
          className="cursor-pointer bg-blue-500 border-none text-white hover:bg-blue-600 hover:text-white"
          disabled={isSubmitting}
        >
          Sign in
          {isSubmitting && <LoaderCircle className="animate-spin"/> }
        </Button>
      </form>
      
      <div className="mt-2 text-sm">
        <span>Don&apos;t have an account?{" "}</span>
        <Link to="/sign-up" className="underline underline-offset-4 text-blue-500">Sign up</Link>
      </div>
    </div>
  )
}