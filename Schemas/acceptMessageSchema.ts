import { z } from "zod";

export const checkAcceptMessageSchema = z.object({
    isAcceptingMessages : z.boolean()
})