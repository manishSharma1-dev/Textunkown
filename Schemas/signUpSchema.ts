import { z } from "zod"

export const checkUserName = z
    .string()
    .min(3,"UserName must be atleast of two character")
    .max(15,"Username must not exceed 15 cahracter")

const checkPassword = z
    .string()    
    .min(5,"Password must be atleast of 5 character")
    .max(20,"Password len must nod exceded the len of 20")

const checkEmail = z
    .string() 
    .email({ message : "Invalid Emial address"})   


// will check credential when we will create a new User     
export const checkSignUpSchema = z.object({
    username : checkUserName,
    email: checkEmail,
    password : checkPassword
}) 

// export { 
//     checkUserName,
//     checkEmail,
//     checkPassword
// }
