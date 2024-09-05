//We are using here CREDENTIALS -> WHERE you have you own settings and need to authenticate user against it .

import { connectDB } from "@/lib/databaseConnection";
import { NextAuthOptions } from "next-auth";
import { Usermodel } from "@/models/user.model";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const authOptions:NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id : 'credentials',
            name : 'credentials',

            credentials : {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials:any) : Promise<any> {

                try {

                    await connectDB() 

                    const user = await Usermodel.findOne({
                        $or : [
                            { email : credentials?.identifiers},
                            { password : credentials?.identifiers}
                        ]
                    })
                    
                    if(!user){
                        throw new Error("User Not Found")
                    }

                    if(!user.isverified){
                        throw new Error("Verify you email firstly before login")
                    }

                    const isPasswordCorrect: boolean = await bcrypt.compare(credentials.password,user.password)

                    if(isPasswordCorrect){
                        return user
                    } else {
                        return Response.json({ success : false, message : "Password didn't match "},{ status : 500 })
                    }

                } catch (error : any) {
                    throw new Error("Failed to find the user",error)
                }

            }
        })
    ]
}