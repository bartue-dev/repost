import { z } from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "../../lib/zod-schema";
import { authClient } from "../../lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import type { ApiErr } from "../../lib/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";

type SignUpData = z.infer<typeof SignUpSchema>

export default function SignUp() {
  const [serverErr, setServerErr] = useState<{error?: string}>({})
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting}
  } = useForm<SignUpData>({
    resolver: zodResolver(SignUpSchema)
  });

  const {
    mutate: signUp
  } = useMutation({
    mutationFn: async (data: SignUpData) => {
      const response = await authClient.signUp.email({
        email: data.email,
        name: data.name,
        password: data.password
      })

      return response
    },
    onSuccess: () => {
      setServerErr({})
    },
    onError: (error: ApiErr) => {
      reset()
      console.error(error);

      /* Server errors */
      const validateServer = {} as {error:string}

      if (!error?.status) {
        //if server is not running
        validateServer.error = "No server response"
      } else if (error?.response?.data?.message.split(":")[0] === "P2002") {
        //if username is already exist
        validateServer.error = "Username already exist"
      } else if (error?.status === 400) {
        //if status is equal to 400
        validateServer.error = "Failed to create an account"
      } else {
        //if none of the if statements but also failed
        validateServer.error = "Failed"
      }

      //if validateServer object is not empty set the serverError state
      if (Object.keys(validateServer).length > 0) {
        setServerErr(validateServer)
      }
    }
  })

  const onSubmit = async (data: SignUpData) => {
    signUp(data)
  }

  return (
    <div className="border-1 w-80 place-self-center p-5 mt-10 rounded-md font-sofia-sans">
      <h1 className="text-2xl text-center">Sign up an account</h1>
      {serverErr?.error && <p className="text-sm text-red-600 text-center mt-4">{serverErr.error}</p>}
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 mt-5"  
      >
        <div>
          <label htmlFor="name">Name</label>
          <Input 
            type="text" 
            id="name"
            {...register("name")}
            className="focus-visible:ring-1 focus-visible:ring-offset-0"
          />
          {errors?.name && <p className="text-sm text-red-600">{errors?.name?.message}</p>}
        </div>
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
          Sign up
          {isSubmitting && <LoaderCircle className="animate-spin"/> }
        </Button>
      </form>
      
      <div className="mt-2 text-sm">
        <span>Already have an account?{" "}</span>
        <Link to="/sign-in" className="underline underline-offset-4 text-blue-500">Sign in</Link>
      </div>
    </div>
  )
}