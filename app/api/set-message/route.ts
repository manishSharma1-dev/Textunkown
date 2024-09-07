import { connectDB } from "@/lib/databaseConnection";
import { Usermodel } from "@/models/user.model";
import { Message } from "@/models/user.model";


// this route will set the message for the user 
export async function POST(request: Request) {
    await connectDB()

    try {
        
        const { username , content } = await request.json()

        const user = await Usermodel.findOne({ username })

        if(!user){
            return Response.json(
                {
                    success : false,
                    message : "Username isn't Valid , no user with this Username"
                },
                {
                    status : 500
                }
            )
        }

        if(user.isAcceptingMessages == false){
            return Response.json(
                {
                    success : false,
                    message : "User has disabled for Receiving Message"
                },
                {
                    status : 400
                }
            )
        }

        const newMessage = { content, created_at : new Date() }

        user.messages.push(newMessage as Message)

        await user.save({ validateBeforeSave : true })

        return Response.json(
            {
                success : true,
                message : "User Message is Send Successfully",
                newMessage
            },
            {
                status : 200
            }
        )
        
    } catch (error) {
        console.error("Failed to send the message to the user",error)
        return Response.json(
            {
                success : false,
                message : "Failed to send the message to the user"
            },
            {
                status : 500
            }
        )
    }
}