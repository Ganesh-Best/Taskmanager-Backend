import express from 'express'
import { Request,Response , NextFunction } from 'express';
const Router   =   express.Router();
import {authenticate} from '../Controller/controller';
import {todos} from '../db/db';
import mongoose  from 'mongoose'


Router.post('/todo', authenticate ,async (req: Request,res : Response)=>{
    const {title,description} = req.body;
    
    if(title && description){
       console.log('userID',req.user.id);        
      const isCreated = await  todos.create({userId:req.user.id,title,description,completed:false})
      
       res.status(201).json({message:"Todo created successfully "})

    }else
    res.status(411).json({message:"Invalid inputs :"})

})

Router.get('/todo',authenticate,async(req :Request,res : Response)=>{
     const TODOS  = await todos.find({userId:req.user.id});
     console.log(TODOS)
     res.json({todos:TODOS});
})

Router.patch('/todo/:id/done',authenticate,async(req : Request,res: Response)=>{
      
    console.log('inside Patch Route :');
     const {id} = req.params;
      console.log('Object ID',id)
     if(mongoose.Types.ObjectId.isValid(id)){
                
        const updatedTodo  =  await todos.findByIdAndUpdate({_id:id,userId:req.user.id},{completed:true},{new:true})
          
         res.status(201).json({message:"Todo updated",updatedTodo});

     }else
     res.status(404).json({message:"Invalid Todo ID:"})
     
})





export default Router;