import { z } from "zod";


//signup
export const SignUpSchema = z.object({
  name: z.string().min(1, "Name must not be empty"),
  email: z.email("Invalid email"),
  password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])[A-Za-z\d#?!@$%^&*-]{8,}$/, "Password must be atleast 4 characters or more and must contain number, symbols and letters")
});

//signin
export const SignInSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Invalid password")
});

//create post
export const CreatePostSchema = z.object({
  title: z.string().trim().min(1, "Title must not be empty"),
  content: z.string()
    .refine(
      (val) => {
        const text = val
          .replace(/<[^>]+>/g, "") // remove HTML tags
          .replace(/&nbsp;/g, "")  // remove HTML entities
          .trim()
        return text.length > 0
      },
      { message: "Content cannot be empty" }
    ),
  tags: z.array(z.string()
    , "Invalid tags").min(4, "Please add atleast four (4) tags")
});

//create comment
export const CreateCommentSchema = z.object({
  comment: z.string()
    .refine(
      (val) => {
        const text = val
          .replace(/<[^>]+>/g, "") // remove HTML tags
          .replace(/&nbsp;/g, "")  // remove HTML entities
          .trim()
        return text.length > 0
      },
      { message: "Comment must not be empty" }
    )
})

