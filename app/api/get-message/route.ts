import { connectDB } from "@/lib/databaseConnection";
import { Usermodel } from "@/models/user.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

export async function GET(request:Request) {
    // to get all the Message 
    // 1 -> db connect 
    // 2 -> check if the user is logged in or not 
    // 3 -> get the information of the user if the user ids logged in
    // 4 -> Display the info

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
    
        const userId = new mongoose.Types.ObjectId(session?.user._id) // because of type Script error property

        // here rwe will use mongoose Aggregate pipeline

        const user = await Usermodel.aggregate(
            [
                {$match : { id : userId}},
                { $unwind: '$messages'},
                { $sort : { 'messages.created_at' : -1}},
                { $group : { _id: '$_id', messages : { $push : '$messages'}}}
            ]
        )

        if(!user || user.length === 0){
            return Response.json(
                {
                    success : false,
                    messsage : "No Message for this user"
                },
                {
                    status : 400
                }
            )
        }

        return Response.json(
            {
                success : true,
                messsage : user[0]?.messages
            },
            {
                status : 200
            }
        )

    } catch(error){
        console.error("An error Ocuured while fetching all thte message of the User")

        return Response.json(
            {
                success : false,
                messsage : "An error Ocuured while fetching all thte message of the User"
            },
            {
                status : 500
            }
        )
    }
    
}