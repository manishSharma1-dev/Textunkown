import { connectDB } from "@/lib/databaseConnection";
import { z } from "zod";
import { checkUserName } from "@/Schemas/signUpSchema";
import { Usermodel } from "@/models/user.model";

const UserNameQuerySchema = z.object({
    username : checkUserName
})

export async function GET(request: Request) {

    // if(request.method !== 'GET'){
    //     return Response.json(
    //         {
    //             success : 'false',
    //             message :  'Only GET request is Accepted here'
    //         }, {
    //             status : 405
    //         }
    //     )
    // }

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

        console.log("UserName validation checking is Successfull, and the whole result",result)
        
        const { username } = result.data
        
        const existingCerifiedUser = await Usermodel.findOne({ username, isverified 
            : true })

            if(existingCerifiedUser){

                return Response.json(
                    {
                        success : false,
                        message : "Username is already taken"
                    },
                    {
                        status : 500
                    }
                )

            }

        return Response.json(
            {
                success : true,
                message : "Username is unique && Success in checking if usename is accepted by zod Schema"
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



