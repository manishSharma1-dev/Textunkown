// this route will handle the code for otp verififaction 

import { Usermodel } from "@/models/user.model";
import { connectDB } from "@/lib/databaseConnection";


export async function POST(request:Request) {
    await connectDB()

    try {

        const { username,otp } = await request.json()

        const decordedURI = decodeURIComponent(username)

        const user = await Usermodel.findOne({ username:decordedURI })

        if(!user){
            return Response.json(
                {
                    success : false,
                    message : "User not found"
                },
                {
                    status : 404
                }
            )
        }

        const checkifOtpisEqual = user.verifyCode === otp
        const isCodeNotExpired = new Date(user.verifiedCodeExpiry) > new Date()

        if(checkifOtpisEqual && isCodeNotExpired){
           return Response.json(
            {
                success : true,
                message : "Otp matched Successsfully"
            },
            {
                status : 200
            }
           )
        } else if ( !isCodeNotExpired ){
            return Response.json(
                {
                    success : false,
                    message : "verifyCode expired"
                },
                {
                    status : 404
                }
            )
        } else { 
            return Response.json(
                {
                    success : false,
                    message : "otp didn't match"
                },
                {
                    status : 400
                }
            )
        }

        
        
    } catch (error) {
        console.error("Otp Verification failed",error)
        return Response.json(
            {
                success : false,
                message : "Otp varification Failed"
            },
            {
                status : 400
            }
        )
    }
}