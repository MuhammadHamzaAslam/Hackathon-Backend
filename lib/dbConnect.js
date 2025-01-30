import mongoose from "mongoose";

export async function connectDB() {
    try{
        await mongoose.connect("mongodb+srv://FullStack-LMS:FullStack-LMS@muhammadhamza.6b8ek.mongodb.net/Hackathon")
        console.log("DataBase Connected Successfully");
    }catch(e){
        console.log("error agaya", e, "error agaya");
        
    }
}