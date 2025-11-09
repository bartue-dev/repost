import { useUserData } from "@/hooks/use-user-data"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditUserInfoSchema } from "@/lib/zod-schema";
import { useMutation } from "@tanstack/react-query";
import type { ApiErr } from "@/lib/types";
import { LoaderCircle } from "lucide-react";
import { axiosPrivate } from "../axios/axios";

type EditUserInfoData = z.infer<typeof EditUserInfoSchema>;

export default function Settings() {
  const {session , refetch} = useUserData();
  const user = session?.user;

  console.log("USER:", user?.image)

  //zod & useForm
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting}
  } = useForm<EditUserInfoData>({
    resolver: zodResolver(EditUserInfoSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email
    }
  });

  //Edit user info
  const {mutate: updateUserInfo} = useMutation({
    mutationFn: async (data: EditUserInfoData) => {

      console.log("NAME:", data.name)
      console.log("EMAIL:", data.email)
      console.log("IMAGE:", data.image[0])

      const response = await axiosPrivate.put("/v1/api/auth", {
          name: data.name,
          email: data.email,
          profileImg: data.image[0]
        },
        {headers: {"Content-Type": "multipart/form-data"}}
      )

      return response
    },
    onSuccess: (response) => {
      console.log("SETTINGS:", response)
      refetch();
    },
    onError: (error: ApiErr) => {
      console.error(error)
    }
  });

  const onSubmit = (data: EditUserInfoData) => {
    updateUserInfo(data)
  }


  return (
    <div className="p-5">
      <div className="bg-white rounded-md p-5 w-150 mx-auto">
        <p className="font-montserrat font-semibold text-2xl mb-5">User info</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center gap-5 "
        >
          <div className="flex flex-col justify-center gap-2">
            <label 
              htmlFor="name"
              className="font-roboto text-xl w-20"
            >
              Name:
            </label>
            <input
              type="text" 
              id="name" 
              {...register("name")}
              className="bg-white border-gray-200 text-xl py-2 w-full rounded-md p-4 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:outline-blue-500 focus-visible:shadow-none border"
            />
          </div>

          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}

          <div className="flex flex-col justify-center gap-2">
            <label 
              htmlFor="email"
              className="font-roboto text-xl w-20"
            >
              Email:
            </label>
            <input
              type="email" 
              id="email" 
              {...register("email")}
              className="bg-white border-gray-200 text-xl py-2 w-full rounded-md p-4 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:outline-blue-500 focus-visible:shadow-none border"
            />
          </div>

          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}

          <div className="flex flex-col justify-center gap-3">
            <label 
              htmlFor="email"
              className="font-roboto text-xl"
            >
              Profile image:
            </label>

            <div className="flex items-center gap-2">
              <div className="px-2">
                {
                  user?.image ?
                    <div
                      className="block relative"
                    >
                      <img 
                        src={user?.image} 
                        alt="profile-image" 
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    </div> :
                      <div
                        className="rounded-full w-10 h-10 bg-blue-500 flex items-center justify-center text-white text-xl"
                      >
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                }
              </div>
              <input
                type="file" 
                id="email" 
                {...register("image")}
                className="text-base font-roboto text-grey-500
                file:mr-5 file:py-2 file:px-6
                file:rounded-full file:border-0
                file:text-base file:font-medium
                file:bg-blue-50 file:text-blue-600
                hover:file:cursor-pointer hover:file:bg-blue-60
                hover:file:text-text-700"
              />
            </div>
          </div>

          {typeof errors.image?.message === "string" && (
            <p className="text-sm text-red-600">{errors.image.message}</p>
          )}


          <div className="border-t-1 pt-5">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white w-fit rounded-sm font-roboto cursor-pointer hover:bg-blue-600 "
              disabled={isSubmitting}
            >
              {isSubmitting &&
                <LoaderCircle className="text-gray-600 animate-spin"/>
              }
              Save changes
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}