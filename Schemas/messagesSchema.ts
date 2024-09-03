import { z } from "zod";

const checkContentSchema = z
    .string()
    .min(10, { message : "content must be atleast of 10 character"})
    .max(300, { message : "Content must not exceed the length of 300 chracter"})

export const checkMessageSchema = z.object({
    content : checkContentSchema,
    created_at : z.date()
})