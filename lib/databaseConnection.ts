import mongoose from "mongoose";

// the number that db will send if the db is connected
type ConnectionObject = {
    isConnected?: number
}

// checking if db is already conneted or not -> if yes it will return a number
const connection: ConnectionObject = {}

// connecting the db 
async function connectDB(): Promise<void>{
    if(connection.isConnected){
        console.log("Db is already connected")
        return
    } 

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '')

        connection.isConnected = db.connections[0].readyState

        console.log("Mongo db COnnected Successfully")
    } catch (error) {
        console.log("Database Connection failed",error)
        process.exit(1)
    }
}


export {
    connectDB
}