import { z } from "zod";

export const UserSignUpSchema= z.object({
    email: z.email(),
    password: z.string().min(4).max(25),
    confirmPassword: z.string().min(4).max(25),
})

export const UserSignInSchema= z.object({
    email: z.email(),
    password: z.string().min(4).max(25)
})

export const CreateRoomSchema = z.object({
    email: z.email(),
    password: z.string().min(4).max(25)
})