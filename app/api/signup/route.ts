//this  route will work when i will add the mongodb String to the project  

import { connectDB } from "@/lib/databaseConnection";
import { Usermodel } from "@/models/user.model"
import bcrypt from "bcryptjs"
import { SendVerificationEmail } from "@/helpers/SendVerificationEmail";

export async function POST(request : Request){
    await connectDB() //Connecting database
    
    try {

        const {username,email,password } = await request.json() 

        // Checking if user exits or not
        const existedUserisVerifiedbyUsername = await Usermodel.findOne({
            username
        })

        if(existedUserisVerifiedbyUsername){
            return Response.json({
                success: false,
                message : "UserName is already taken"
            },{ status : 4000 })
        }

        const existedUserbyEmail = await Usermodel.findOne({
            email
        })

        // veriyfication Code
        const verifyCode = Math.floor(100000 + Math.random() + 900000).toString() 


        // if User exits 
        if(existedUserbyEmail){

            //if user exits and checking -> if it is verified or not
            if(existedUserbyEmail.isverified){
                return Response.json({ success : false, message : "User already Verified with this email "},{ status :500 })
            } else {
                // in this user exits in db but not verified -> then we send to the verification code to the user for it to get verified

                const HashedPasswordforExistedUserButNotVerified = await bcrypt.hash(password,10)

                if(!HashedPasswordforExistedUserButNotVerified){
                    return Response.json({ success : false, message : "Didn't get the hashed password"},{ status : 500 })
                }

                existedUserbyEmail.password = HashedPasswordforExistedUserButNotVerified
                existedUserbyEmail.verifyCode = verifyCode
                existedUserbyEmail.verifiedCodeExpiry = new Date(Date.now() + 3600000)

                await existedUserbyEmail.save({ validateBeforeSave : true })
                
            }

        } else { 
            // if User Don't exits -> then there is no problem cretae a new User and Send a Verification Code
            
            const hashPassword = await bcrypt.hash(password,10) // hashing password 

            const expiryDate = new Date() //Setting expiry of verififcation code
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = await Usermodel.create({
                username,
                email,
                password : hashPassword,
                verifyCode,
                verifiedCodeExpiry : expiryDate,
                isverified : false,
                isAcceptingMessages  : true ,
                messages : []
            })

            // if user is Successfully Crrated or not
            const checkifUserisCreatedOrNot =await Usermodel.findById(newUser?._id).select(" -password -verifyCode ")

            if(!checkifUserisCreatedOrNot){
                return Response.json({ success : false ,message : "Failed in Creating a NewUser"},{ status : 500 })
            }

            await newUser.save({ validateBeforeSave : true }) // Save the newly created User
        }

        // Sending Otp to the Newly created User 
        const responsefromtheSendVerificationEmail = await SendVerificationEmail(email,username, verifyCode)

        if(!responsefromtheSendVerificationEmail?.success){
            return Response.json({ success : false , message : "Failed to send the email to the User for Verification " },{ status : 500 })
        }

        return Response.json({ success : true, message : " Successfully Created a new User, Verify your Email for the code "},{ status : 200 })

        
    } catch (error) {
        console.error("Error Registering User",error)
        return Response.json({ success : false, message : "Error Occured While registering User"},{ status : 500 })
    }
}