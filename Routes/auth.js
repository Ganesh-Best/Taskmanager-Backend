const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator');
const {users,todos} = require('../db/db');
const Router  =   express.Router();
const {generateJwt,decodeJwt,authenticate,verifyMail} = require('../Controller/controller');
const { default: mongoose } = require('mongoose');

Router.post('/login' , async(req,res)=>{

const {email,password} = req.body ;

    if(email && password){
           
      const isUser  =  await users.findOne({email})
  
        
      const  isMatch  =  await bcrypt.compare(password,isUser.password);
       
      if(isMatch){
         let token  =  generateJwt(isUser._id)
         res.json({message:"login successful :",token})
 
      }else
        res.status(404).json('username and password incorrect ')
       
      
    }else
    res.status(411).json({message:"Username or Password required :"})
})

Router.post('/signup',async (req,res)=>{

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

Router.get('/verify',async(req,res)=>{
 
  const userId = req.query.id 
   
  if(mongoose.Types.ObjectId.isValid(userId)){

         const userVerify  =   await users.findByIdAndUpdate({_id:userId},{isVerify:true},{new:true})
       if(userVerify)
         res.send('<h1>congratulations your email is verified </h1>')

  }else
  res.status(411).json({message:"Invalid user id "})

})


module.exports = Router;