import { Controller, useForm } from "react-hook-form";  
import { CreateCommentSchema } from "@/lib/zod-schema";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosPrivate } from "../axios/axios";
import { LoaderCircle } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import type { ApiErr, CommentPropsType } from "@/lib/types";
import CommentTextEditor from "./comment-text-editor";
import DOMPurify  from "dompurify";
import CommentActions from "./comment-actions";
import { useState } from "react";
import ChildCommentForm from "./child-comment";

type CommentData = z.infer<typeof CreateCommentSchema>;

//Comment Component
export default function Comments({post, setIsCommentAdded} : CommentPropsType ) {
  const [isReplyBtn, setIsReplyBtn] = useState<string | undefined>(undefined)
  const queryClient = useQueryClient(); // useQueryClient is use for global invalidation
  const navigate = useNavigate();
  const location = useLocation();

  //useForm & zod
  const {
    handleSubmit,
    reset,
    control,
    formState: {errors, isSubmitting}
  } = useForm<CommentData>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      comment: ""
    }
  });

  //comment mutation query
  const {mutate: addComment} = useMutation({
    mutationFn: async (data : CommentData) => {
      const response = await axiosPrivate.post(`/v1/api/comment/post/${post?.id}`, {
        comment: data.comment
      });

      return response;
    },
    onSuccess: () => {
      setIsCommentAdded(true)
      queryClient.invalidateQueries({queryKey: ["post", post?.id]});
      reset()
    },
    onError: (error: ApiErr) => {
      console.error("Add comment error:",error)
      if (error?.status === 401) {
        navigate("/sign-in", { state: { from: location }, replace: true })
      }
    }
  });

  //submit function
  const onSubmit = (data: CommentData) => {
    addComment(data)
  }

  return (
    <div className="mt-7 ">
      <h1 className="text-2xl mb-8 font-bold font-montserrat">Comments</h1>
      {/* add comment input */}
      <div className="flex">
        <div className="p-2 pt-0">
          <div 
            className="rounded-full w-10 h-10 bg-gray-100 flex items-center justify-center text-xl font-bold font-roboto"
          >
            {post?.user.name.charAt(0)}
          </div>
        </div>

        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="min-w-226 overflow-hidden space-y-4"
        >
          {/* comment controller */}
          <Controller
            name="comment"
            control={control}
            render={({field}) => (
              <CommentTextEditor
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {/* comment validation error */}
          {errors.comment && <p className="text-sm text-red-600">{errors.comment.message}</p>}

          <button
            type="submit"
            className="border px-4 py-2 rounded-md bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting
              && <LoaderCircle size={50} className="animate-spin text-center text-gray-700"/>
            }
            Submit
          </button>
        </form>
      
      </div>
      <div className="space-y-5 mt-8">
        {post?.comment.map(c => {
          
        const sanitizeComment = DOMPurify.sanitize(c.comment);

         return (
          <div key={c.id}>
            {/* parent comment */}
            <div>
              <div className="flex gap-2">
                <div>
                  <div 
                    className="rounded-full w-12 h-12 bg-gray-100 flex items-center justify-center text-xl font-bold font-roboto"
                  >
                    {c.user.name.charAt(0)}
                  </div>
                </div>
                <div 
                  className="border p-3 rounded-sm space-y-2 w-226 relative"
                >
                  <div className="flex gap-2">
                    <div 
                      className="font-sofia-sans font-semibold"
                    >
                      {c.user.name} &bull;
                    </div>
                    <div 
                      className="font-sofia-sans text-gray-800"
                    >
                      {format(new Date(c.createdAt), "MMM dd")}
                    </div>
                  </div>
                  <div>
                    <div
                      className="ql-editor"
                      dangerouslySetInnerHTML={{__html: sanitizeComment}}
                    />
                  </div>
                  <div className="absolute right-5 top-2">
                    <CommentActions
                      commentUserId={c.userId}
                      postUserId={post.userId}
                      commentId={c.id}
                      postId={post.id}
                    />
                  </div>
                </div>                
              </div>
              {/* Reply button */}
              <button
                className="cursor-pointer text-gray-800 text-sm font-sofia-sans ml-14 hover:underline"
                onClick={() => setIsReplyBtn(c.id)}
              >
                Reply
              </button>
              {/* if isReplyBtn state is equal to i render ChildCommentForm */}
              {
                isReplyBtn === c.id
                &&
                  <div className="ml-20 mt-5">
                    <ChildCommentForm
                      setIsReplyBtn={setIsReplyBtn}
                      commentId={c.id}
                      commentAuthor={c.user.name}
                      postId={post.id}
                    />
                  </div>
              }
            </div>
            {/* child comment */}
            <div className="space-y-5 mt-5 ml-12">
              {c.childComment.map(cc => {
                
              const sanitizeChildComment = DOMPurify.sanitize(cc.comment);


                return (
                  <div key={cc.id}>
                    {/* child comment */}
                    <div className="flex gap-2">
                      <div 
                        className="rounded-full w-12 h-12 bg-gray-100 flex items-center justify-center text-xl font-bold font-roboto"
                      >
                        {c.user.name.charAt(0)}
                      </div>
                      <div className="border w-full p-3 rounded-sm space-y-2 relative">
                        <div className="flex gap-2">
                          <div 
                            className="font-sofia-sans font-semibold"
                          >
                            {cc.user.name} &bull;
                          </div>
                          <div 
                            className="font-sofia-sans text-gray-800"
                          >
                            {format(new Date(cc.createdAt), "MMM dd")}
                          </div>
                        </div>
                        <div>
                          <div
                            className="ql-editor"
                            dangerouslySetInnerHTML={{__html: sanitizeChildComment}}
                          />
                        </div>

                        <div className="absolute right-5 top-2">
                          <CommentActions
                            commentUserId={cc.userId}
                            postUserId={post.userId}
                            commentId={cc.id}
                            postId={post.id}
                          />
                        </div>
                      </div>
                    </div>  

                    <button
                      className="cursor-pointer text-gray-800 text-sm font-sofia-sans ml-14 hover:underline"
                      onClick={() => setIsReplyBtn(cc.id)}
                    >
                      Reply
                    </button>
                    {/* if isReplyBtn state is equal to i render ChildCommentForm */}
                    {
                      isReplyBtn === cc.id
                      &&
                        <div className="ml-20 mt-5">
                          <ChildCommentForm
                            setIsReplyBtn={setIsReplyBtn}
                            commentId={c.id}
                            commentAuthor={cc.user.name}
                            postId={post.id}
                          />
                        </div>
                    }
                  </div>
                )
              })}
            </div>
          </div>
         )
        })}
      </div>
    </div>
  )
}