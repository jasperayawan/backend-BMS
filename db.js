const mongoose = require("mongoose");

const conn = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connected to database");
    }   
    catch(error){
        console.log("internal server error", error)
    }
}

module.exports = conn;