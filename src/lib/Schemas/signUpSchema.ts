import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 characters ")
  .max(20, "Username must be no more than 20 charactes")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username must not contain special character other than underscore '_' "
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.email({ error: "Must have a valid email address" }),
  //   email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { error: "Password must be atleast 6 characters long" }),
});
