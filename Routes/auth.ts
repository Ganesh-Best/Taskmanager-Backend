import express  from 'express'
import {Request,Response} from 'express'
import bcrypt from 'bcrypt'
import validator from 'validator'
import {users,todos} from'../db/db'
const Router  =   express.Router();
import {generateJwt,decodeJwt,authenticate,verifyMail} from '../Controller/controller';
import  mongoose from 'mongoose';

Router.post('/login' , async(req : Request,res : Response)=>{

const {email,password} = req.body ;

    if(email && password){
           
        const isUser  =  await users.findOne({email})
      
            if(isUser != null){
        
              const  isMatch  =  await bcrypt.compare(password,isUser.password);
       
             if(isMatch){
               let token  =  generateJwt(isUser._id)
               res.json({message:"login successful :",token})
      }else{
        res.status(404).json({message:"User not found :"})
         
      }
      }else
        res.status(404).json('username and password incorrect ')
       
      
    }else
    res.status(411).json({message:"Username or Password required :"})
})

Router.post('/signup',async (req : Request,res: Response)=>{

    const { name,email,mobile,password} = req.body;

    if(name && validator.isEmail(email) && validator.isNumeric(mobile) && password){
           
            let isFound   =  await users.findOne({email});       
            
            if(isFound != null){
               res.json({message:"User already exists :"})
            }else{
             let salt       =   await bcrypt.genSalt(10) 
             let hashPass   =   await bcrypt.hash(password,salt)
             let isCreated  =   await users.create({
                        name,email,mobile,isVerify:false,password:hashPass
                      })
              verifyMail(name,email,isCreated._id)    
                res.status(201).json({message:"Signup has been done successfully :"})                      

            }

    }else
     res.status(411).json({message:"Invalid inputs :"})

})

Router.get('/verify',async(req : Request,res: Response)=>{
 
  const userId: string|undefined = req.query.id as string | undefined ;
  
  if(userId){
  
      if(mongoose.Types.ObjectId.isValid(userId)){

         const userVerify  =   await users.findByIdAndUpdate({_id:userId},{isVerify:true},{new:true})
       if(userVerify)
         res.send('<h1>congratulations your email is verified </h1>')

      }else
      res.status(411).json({message:"Invalid user id "})
    }
})


export default Router;