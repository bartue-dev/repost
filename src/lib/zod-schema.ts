import { z } from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(1, "Name must not be empty"),
  email: z.email("Invalid email"),
  password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])[A-Za-z\d#?!@$%^&*-]{8,}$/, "Password must be atleast 4 characters or more and must contain number, symbols and letters")
});

export const SignInSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Invalid password")
})