const {Router}=require("express")
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const userRouter=Router()
const {userModel}=require('../Models/user.schema')
const { logoutModel } = require("../Models/logout.model")
userRouter.post(`/register`,async(req,res)=>{
   try {
    const {userName,email,password}=req.body
    console.log(bcrypt,'is encyrpting')
    //experimenting new bcryptjs
    bcrypt.genSalt(10, function(err, salt) {
     bcrypt.hash(password, salt, async function(err, hash) {
            // Store hash in your password DB.
            if(err){
                res.status(401).send(`please Register again`)
            }else{
                console.log(hash,'is hashed')
                const user=await userModel.create({userName,email,password:hash})
                console.log(user)
                return res.status(201).json({user})
            }
        });
    });
    // till here
   } catch (error) {
    console.log(error.message,'is error')
    res.status(400).send({err:error.message})
   }
})
userRouter.post('/login',async(req,res)=>{
    try {
        const {email,password}=req.body
        const user=await userModel.find({email})
        console.log(user,'is user')
        if(user.length){
            bcrypt.compare(password, user[0].password, function(err, result) {
                console.log(err,result)
                if(result===true){
                    console.log(result,'is result')
                    const token=jwt.sign({userId:user[0]._id,userName:user[0].userName},'masai')
                    console.log(token)
                   return res.status(200).json({msg:`logged-in successfully`,token,id:user[0]._id}) 
                }else{
                    return res.status(402).json({msg:`wrong password`})
                }
            });
        }else{
            res.status(400).send(`email doesn't exist`)
        }
    } catch (error) {
        console.log(error.message,'is error')
       res.status(400).send(`please login again`) 
    }
})
userRouter.post('/logout',async(req,res)=>{
    try {
       const token=req.headers.authorization
       if(token){
        // push token into logout collection to check while authorizing
        const loggedOut=await logoutModel.create({token})
        res.status(200).json({loggedOut,msg:'Logged-out successfully'})
       }else{
        res.status(400).send({msg:`please logout again`})
       }
    } catch (error) {
        res.status(401).send({err:error.message})
    }
})
module.exports={userRouter}