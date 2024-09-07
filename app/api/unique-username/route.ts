import { connectDB } from "@/lib/databaseConnection";
import { z } from "zod";
import { checkUserName } from "@/Schemas/signUpSchema";

const UserNameQuerySchema = z.object({
    username : checkUserName
})

export async function GET(request: Request) {
    await connectDB()

    try { 

        const { searchParams } = new URL(request.url)

        const queryParams = { 
            username : searchParams.get('username')
        }

        if(!queryParams){
            throw new Error("username not found in the query Parameter")
        }

        const result = UserNameQuerySchema.safeParse(queryParams)

        if(!result.success){
            throw new Error("Checking username validation falied",result.error)
        }

        console.log("UserName validation checking is Successfull, and the result")

        return Response.json(
            {
                success : true,
                message : "Success in checking if usename is accepted by zod Schema"
            },
            {
                status : 500
            }
        )
        
    } catch (error) {
        console.error("An error Occured while checking for the user name Verification ")
        return Response.json(
            {
                success : true,
                message : "username validation checking failed"
            },
            {
                status : 500
            }
        )
    }
}



