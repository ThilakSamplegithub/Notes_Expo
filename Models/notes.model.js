const mongoose=require('mongoose')
const notesSchema=new mongoose.Schema({
title:{type:String,required:true},
description:{type:String,required:true},
id:{type:mongoose.Schema.Types.ObjectId,ref:"users"}
},{versionKey:false})
const notesModel=mongoose.model('note',notesSchema)
module.exports={notesModel}