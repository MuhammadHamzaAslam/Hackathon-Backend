import mongoose from "mongoose";

export async function connectDB() {
    try{
        await mongoose.connect("mongodb+srv://muhammadahmedaslamofficial:ahmedcluster1@muhammadahmed.hr3zm.mongodb.net/FinalHackatonSMIT")
        console.log("DataBase Connected Successfully");
    }catch(e){
        console.log("error agaya", e, "error agaya");
        
    }
}