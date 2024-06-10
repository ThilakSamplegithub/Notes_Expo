const {Router}=require("express")
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const notesRouter=Router()
const {notesModel}=require('../Models/notes.model')
// retrieving notes of particular user
notesRouter.get('/',async(req,res)=>{
    try {
      const {userId}=req.userId  
      const user=await notesModel.find({id:req.userId})
    //   const usersNote=await user.populate('req.userId')
      console.log(user)
      return res.status(201).json({msg:user})
    } catch (error) {
       res.status(400).send({err:error.message}) 
    }
})
// first add notes
notesRouter.post('/add',async(req,res)=>{
    try {
        console.log(req,'is request')
        const {userId}=req.userId
        console.log(req.userId,'is users id')
       const {title,description}=req.body
       console.log(title,description,userId,'are there')
       if(req.userId.length){
        const note= await notesModel.create({title,description,id:req.userId}) 
        console.log(note)
      return  res.status(200).json({msg:'notes added',note})
       }else{
       return res.status(400).send(`No such user exists`)
       }
    } catch (error) {
     return res.status(400).send({err:error.message})  
    }
})
notesRouter.delete('/delete/:noteId',async(req,res)=>{
    try {
        const {noteId}=req.params
        // 1st check whether same person or not
        const note=await notesModel.findOne({_id:noteId})
        if(String(note.id)===String(req.userId)){
            const deletedNote=await notesModel.deleteOne({_id:String(noteId)})
            console.log(deletedNote)
            return res.status(200).json({msg:'deleted successfully'})
        }else{
            // cant delete
            return res.status(400).send({msg:'You are not authorized to delete'})
        }
       // delete particualr note only of that user
    } catch (error) {
        res.status(401).send({err:error.message})
    }
})
notesRouter.patch('/update/:noteId',async(req,res)=>{
    try {
        // console.log(req)
        const {noteId}=req.params
        console.log(req.body,'is body')
        const{title,description}=req.body
        const note=await notesModel.findOne({_id:noteId})
        // Build the update object dynamically
        const updateData = {};
        if (title){
         updateData.title = title;
        }
        if (description){
            updateData.description = description;
        }
        console.log(updateData,'is updated')
        if(String(note.id)===String(req.userId)){
            const updatedNote=await notesModel.updateOne({_id:noteId},{$set:updateData})
            console.log(updatedNote,'is updated one')
            return res.status(200).json({msg:'Updated successfully'})
        }else{
            // cant delete
            return res.status(400).send({msg:'You are not authorized to edit'})
        }  
    } catch (error) {
        return res.status(400).send({err:error.message})
    }
})
module.exports={notesRouter}