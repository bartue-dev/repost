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

const MAX_FILE_SIZE = 510241024
const ACCEPTED_IMAGE_TYPES = [
'image/jpeg',
'image/jpg',
'image/png',
'image/webp',
]

//signup
export const EditUserInfoSchema = z.object({
  name: z.string().min(1, "Name must not be empty"),
  email: z.email("Invalid email"),
  image: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) return true; // allow empty
        return files.length === 1;
      },
      { message: "Only one image file is allowed." }
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        return files[0].size <= MAX_FILE_SIZE;
      },
      { message: `Max file size is 5MB.` }
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        return ACCEPTED_IMAGE_TYPES.includes(files[0].type);
      },
      { message: ".jpg, .jpeg, .png and .webp files are accepted." }
    ),
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

