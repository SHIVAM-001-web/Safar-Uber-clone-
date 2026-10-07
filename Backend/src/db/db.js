const mongoose= require('mongoose') ;

    const ConnectDB= async()=>{
        try{
        await mongoose.connect(process.env.MONGO_URI) ;
        console.log("Connected to DB")
            }
        catch(err){
        console.log("Connection failed to DB",err.message)
                }
    }

module.exports=ConnectDB