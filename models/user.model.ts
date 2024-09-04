import mongoose,{Schema, Document} from "mongoose";

// defining types of the messages  
export interface Message extends Document{
    content : string;
    created_at : Date;
}

// Schema of messages -> and his type is Schema and the constent type is messages
const MessageSchema: Schema<Message> = new Schema({
    content : {
        type : String,
        required : true
    },
    created_at : {
        type : Date,
        required : true,
        default : Date.now
    }
})

// defining types of the User model  
export interface User extends Document{
    username : string,
    email : string,
    password : string,
    verifyCode  : string,
    verifiedCodeExpiry : Date,
    isverified : boolean,
    isAcceptingMessages : boolean,
    messages : Message[]
}

// Creating Schema of User -> type is model is Schema but the data that it will store has a custom type of User
const UserSchema: Schema<User> = new Schema({
    username : {
        type : String,
        required :[true, "Username is required"],
        unique : true
    },
    email : {
        type : String,
        required: [true, "Email is required"],
        unique : true
    },
    password : {
        type : String,
        required : [true, "Password is required"]
    },
    verifyCode : {
        type : String,
        required :[true, "Verification Code is required"],
        unique  :true
    },
    verifiedCodeExpiry : {
        type : Date,
        required : true
    },
    isverified : {
        type : Boolean,
        default : false
    },
    isAcceptingMessages : {
        type : Boolean,
        default : true
    },
    messages : [MessageSchema] //for Message an already MessageScheam is defined

}, { timestamps : true })



// Next js is an edge type language -> in work differntly from the node js like you will not have an infomartion that the db is already Startd or not , so you need to check it firtly if yes -> like the db is started then dont need to start it again , if no then as usual start it again.
const Usermodel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

export {
    Usermodel
}