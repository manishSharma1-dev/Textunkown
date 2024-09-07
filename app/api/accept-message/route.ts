import { Usermodel } from "@/models/user.model";
import { connectDB } from "@/lib/databaseConnection";
import { getServerSession } from "next-auth"; // will give the session 
import { authOptions } from "../auth/[...nextauth]/options";


// how --? 
// 1. db connect 
// 2. check if the user is login or not - through session,token
// 3. find the detail of the user from the session
// 4. check if uesr is accepting messsage or not
// 5.and displ;ay result 

// this request will currently let user to toggle between to accept or decline accepting message
export async function POST(request: Request) {
    await connectDB()

    try {

        const session = await getServerSession(authOptions)

        if(!session){
            return Response.json(
                {
                    success : false,
                    messsage : "User is logged out, user must logged in first"
                },
                {
                    status : 404
                }
            )
        }

        const userID  = session?.user._id

        const { AcceptingMessages } =  await request.json()

        if(!userID){
            return Response.json(
                {
                    success : false,
                    messsage : "session doesnot contain the user Id"
                },
                {
                    status : 404
                }
            )
        }

        const findexistedUserandUpdateIsAcceptingMessageStatus = await Usermodel.findByIdAndUpdate(userID,
            {
                isAcceptingMessages  : AcceptingMessages
            },
            {
                new : true
            }
        )

        if(!findexistedUserandUpdateIsAcceptingMessageStatus){
            return Response.json(
                {
                    success : false,
                    messsage : "cant able to update the User isAccepting Message Status"
                },
                {
                    status : 404
                }
            )
        }

        return Response.json(
            {
                success : true,
                messsage : "Changed the Status of Is Accepting Message Successfully",
                findexistedUserandUpdateIsAcceptingMessageStatus
            },
            {
                status : 201
            }
        )

    } catch (error) {
        console.error("Failed in switching between accepting or decline message")
        return Response.json(
            {
                success : false,
                messsage : "Failed in switching between accepting or decline message"
            },
            {
                status : 404
            }
        )
    }
}


// this request will tell if the user is accepting message or not
export async function GET(request:Request) {
    await connectDB()

    try {
        const session = await getServerSession(authOptions)
    
        if(!session){
            return Response.json(
                {
                    success : false,
                    message : "user must be logged in"
                },
                {
                    status : 400
                }
            )
        }
    
        const userId = session?.user._id
    
        if(!userId){
            return Response.json(
                {
                    success : false,
                    messsage : "session doesnot contain the user Id"
                },
                {
                    status : 404
                }
            )
        }
    
        const existedUser = await Usermodel.findById(userId)
    
        if(!existedUser){
            throw new Error("No User exits with this user ID")
        }
    
        const StatusOfUser_if_he_IsAcceptingMessage = existedUser?.isAcceptingMessages
    
        return Response.json(
            {
                success : true,
                message : "found User detail if he is accepting Message or not",
                StatusOfUser_if_he_IsAcceptingMessage
            },
            {
                status : 200
            }
        )
    } catch (error) {
        console.error("An Error Occured while finding if the user is accepting maessge or not")
        return Response.json(
            {
                success : false,
                message : "An Error Occured while finding if the user is accepting maessge or not",
            },
            {
                status : 500
            }
        )
    }

}




