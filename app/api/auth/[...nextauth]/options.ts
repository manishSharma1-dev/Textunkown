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
    ],
    callbacks : { 
        async jwt({ token, user }) {
            if(user){ //Adding custom value to the token to avoid extra database query
                token._id = user?._id?.toString()
                token.isverified = user.isverified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }

            return token
        },
        async session({ session, token }) { //adding custom value to the session token
            if( token ){
                session.user._id = typeof(token._id)=='string'?token._id:''
                session.user.isverified = typeof(token?.isverified)=='boolean'?token.isverified:false
                session.user.isAcceptingMessages = typeof(token.isAcceptingMessages)=='boolean'?token.isAcceptingMessages:false
                session.user.username = typeof(token.username)=='string'?token.username:''
            }
            return session
        }
    },
    pages : {
        signIn : '/sign-in' //Next auth will automatically Create a sign-in page by this cmd...
    },
    session :  {
        strategy : 'jwt', //will by default use session jwt 
    }, 
    secret : process.env.NEXTAUTH_SECERET_KEY
}