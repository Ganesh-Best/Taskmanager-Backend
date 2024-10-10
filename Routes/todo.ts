import express from 'express'
import { Request,Response , NextFunction } from 'express';
const Router   =   express.Router();
import {authenticate,newRequest} from '../Controller/controller';
import {Todo, todos ,deleteResult} from '../db/db';
import mongoose  from 'mongoose'


Router.post('/todo', authenticate ,async (req: newRequest,res : Response)=>{
    const {title,description}:{title:string;description:string} = req.body;
    
    if(title && description && req?.user){

      const isCreated: Todo = await  todos.create({userId:req.user.id,title,description,completed:false})
      
       res.status(201).json({message:"Todo created successfully "})

    }else
    res.status(411).json({message:"Invalid inputs :"})

})

Router.get('/todo',authenticate,async(req :newRequest,res : Response)=>{

     if(req?.user){
     const TODOS: Todo[] = await todos.find({userId:req.user.id}); // very important as it will return array of object that why we use []
     console.log(TODOS)
     res.json({todos:TODOS});
     }
})

Router.patch('/todo/:id/done',authenticate,async(req : newRequest,res: Response)=>{
      
    console.log('inside Patch Route :');
     
    const {id} = req.params;
      console.log('Object ID',id)
     if(mongoose.Types.ObjectId.isValid(id) && req?.user){
                
        const updatedTodo: Todo|null  =  await todos.findByIdAndUpdate({_id:id,userId:req.user.id},{completed:true},{new:true})
         if(updatedTodo != null) 
         res.status(201).json({message:"Todo updated",updatedTodo});

     }else
     res.status(404).json({message:"Invalid Todo ID:"})
     
})

Router.delete('/todos',authenticate, async(req: newRequest,res:Response)=>{
       const userId : string|undefined =   req.user?.id   ;  

        if(userId){
             const  deletedTodos : deleteResult   =  await  todos.deleteMany({userId})

             console.log('deleted Todos :',deletedTodos);

             if(deletedTodos ){
                      
                res.status(201).json({message:'success',deleteCount:deletedTodos.deletedCount})
               
             }
        }else{
           res.status(404).json({message:"fail",})

        }
})




export default Router;