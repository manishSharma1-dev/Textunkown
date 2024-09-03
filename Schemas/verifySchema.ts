import { z } from "zod"

// to check the code/otp pass to the client and then client enter the code
export const checkVerifySchema = z.object({
    code : z.string().length(6, { message : " verfication code must be of 6 characters"})
})