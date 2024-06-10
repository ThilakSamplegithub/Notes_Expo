const mongoose=require('mongoose')
const logoutSchema=new mongoose.Schema({
    token:{type:String,required:true}
},{versionKey:false})
const logoutModel=mongoose.model('logout',logoutSchema)
module.exports={logoutModel}