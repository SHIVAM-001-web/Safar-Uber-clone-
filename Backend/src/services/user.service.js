const userModel= require('../models/user.model') ;

module.exports.createUser = async({
    fullname, email, password
})=>{
    if( !fullname.firstname || !password || !email){
        throw new Error("All field are required") ;
    }
    const user = await userModel.create({
        fullname:{
            firstname:fullname.firstname,
            lastname:fullname.lastname
        },
        email,
        password
    })
    return user ;
} ;


