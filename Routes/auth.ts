import express  from 'express'
import {Request,Response} from 'express'
import bcrypt from 'bcrypt'
import validator from 'validator'
import {users,todos} from'../db/db'
const Router  =   express.Router();
import {generateJwt,decodeJwt,authenticate,verifyMail,User} from '../Controller/controller';
import  mongoose from 'mongoose';

Router.post('/login' , async(req ,res : Response)=>{

const {email,password}: {email:string;password:string} = req.body ;

    if(email && password){
           
        const isUser : User|null  =  await users.findOne({email})
      
            if(isUser != null){
        
              const  isMatch : boolean  =  await bcrypt.compare(password,isUser.password);
       
             if(isMatch){
               let token: string  =  generateJwt(isUser._id)
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

    const { name,email,mobile,password}:{name:string,email:string,mobile:number,password:string} = req.body;

    if(name && validator.isEmail(email) && mobile && password){
           
            let isFound : User | null   =  await users.findOne({email});       
            
            if(isFound != null){
               res.json({message:"User already exists :"})
            }else{
             let salt : string     =   await bcrypt.genSalt(10) 
             let hashPass : string  =   await bcrypt.hash(password,salt)
             let isCreated : User    =   await users.create({
                        name,email,mobile,isVerify:false,password:hashPass
                      } )
              if(isCreated != null)        
              verifyMail(name,email,isCreated._id)    
                res.status(201).json({message:"Signup has been done successfully :"})                      

            }

    }else
     res.status(411).json({message:"Invalid inputs :"})

})

Router.get('/verify',async(req : Request,res: Response)=>{
 
  const userId: string = req.query.id as string  ;
  
  if(userId){
  
      if(mongoose.Types.ObjectId.isValid(userId)){

         const userVerify: User | null  =   await users.findByIdAndUpdate({_id:userId},{isVerify:true},{new:true})
       if(userVerify)
         res.send('<h1>congratulations your email is verified </h1>')
       else
         res.send('<h1>Ops something went wrong , please try again : </h1>')
      }else
      res.status(411).json({message:"Invalid user id "})
    }
})


export default Router;