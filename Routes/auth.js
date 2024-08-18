const express = require('express');
const bcrypt = require('bcrypt');
const {users,todos} = require('../db/db');
const Router  =   express.Router();

Router.post('/login' , async(req,res)=>{

const {email,password} = req.body ;

    if(email && password){
           
        

      const isUser  =  await users.findOne({email})
  
       console.log('isUser pas',isUser.password)
        
      const  isMatch  =  await bcrypt.compare(password,isUser.password);
       
      if(isMatch){
           
         res.json({message:"login successful :"})
 
      }else
        res.status(404).json('username and password incorrect ')
       
      
    }else
    res.status(411).json({message:"Username or Password required :"})
})

Router.post('/signup',async (req,res)=>{

    const { name,email,mobile,password} = req.body;

    if(name && email && mobile && password){
           
            let isFound   =  await users.findOne({email});       
            
            if(isFound != null){
               res.json({message:"User already exists :"})
            }else{
                 let salt         =   await bcrypt.genSalt(10) 
             let hashPass  =   await bcrypt.hash(password,salt)
              let isCreated   =   await users.create({
                        name,email,mobile,password:hashPass
                      })
              
                res.status(201).json({message:"Signup has been done successfully :"})                      

            }

    }else
     res.status(411).json({message:"Length required :"})

})


module.exports = Router;