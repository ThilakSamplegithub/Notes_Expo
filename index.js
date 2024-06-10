const express=require("express")
const app=express()
require('dotenv').config()
app.use(express.json())
const {connection}=require('./config/db')
const {userRouter}=require("./Controllers/user.controller")
const {authMiddleWare } = require("./Middlewares/auth.middleware")
const { notesRouter } = require("./Controllers/notes.controller")
const port=process.env.PORT
app.get('/',(req,res)=>{
    res.status(200).send(`Welcome`)
})
app.use(authMiddleWare)
app.use('/user',userRouter)
app.use('/notes',notesRouter)
app.listen(port,async(req,res)=>{
    try{
        await connection
        console.log(`port ${port} is running`)
    }catch(err){
        console.log(err)
    }
})