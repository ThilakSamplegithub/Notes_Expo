const jwt=require('jsonwebtoken')
const { logoutModel } = require('../Models/logout.model')
 async function authMiddleWare(req,res,next){
try {
    const token=req.headers.authorization
    const checkTokenExist=await logoutModel.find({token})
    if(token && checkTokenExist.length===0){
        // check whether token is right
        jwt.verify(token,'masai',(err,decoded)=>{
            if(err){
                res.status(400).send('you are not authorized')
            }else{
                console.log(decoded,'is decoded')
                const {userId,userName}=decoded
                req.userId=userId
                req.userName=userName
                next()
                return
            }
        })
    }else{
        res.status(400).send(`You are not authorized`)
    }
} catch (error) {
  res.status(400).send(`You are not authorized`)  
}
}
module.exports={authMiddleWare}