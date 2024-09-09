import { z } from "zod"


//Checking credential when user will signin/login
export const checkSignInSchema = z.object({
    username : z.string(),  // identifier as a username
    email : z.string(),
    password  :z.string()
})