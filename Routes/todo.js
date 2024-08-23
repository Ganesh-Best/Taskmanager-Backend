const express = require('express');
const Router   =   express.Router();
const {authenticate} = require('../Controller/controller');
const {todos} = require('../db/db');
const mongoose = require('mongoose');


Router.post('/todo', authenticate ,async (req,res)=>{
    const {title,description} = req.body;
    
    if(title && description){
       console.log('userID',req.user.id);        
      const isCreated = await  todos.create({userId:req.user.id,title,description,completed:false})
      
       res.status(201).json({message:"Todo created successfully "})

    }else
    res.status(411).json({message:"Invalid inputs :"})

})

Router.get('/todo',authenticate,async(req,res)=>{
     const TODOS  = await todos.find({userId:req.user.id});
     console.log(TODOS)
     res.json({todos:TODOS});
})

Router.patch('/todo/:id/done',authenticate,async(req,res)=>{
      
    console.log('inside Patch Route :');
     const {id} = req.params;
      console.log('Object ID',id)
     if(mongoose.Types.ObjectId.isValid(id)){
                
        const updatedTodo  =  await todos.findByIdAndUpdate({_id:id,userId:req.user.id},{completed:true},{new:true})
          
         res.status(201).json({message:"Todo updated",updatedTodo});

     }else
     res.status(404).json({message:"Invalid Todo ID:"})
     
})




module.exports =  Router;