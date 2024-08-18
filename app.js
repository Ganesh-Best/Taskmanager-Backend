const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const authRoute = require('./Routes/auth');
const todoRoute = require('./Routes/todo');

app.use(express.json())

app.use('/auth',authRoute);

app.use('/todo',todoRoute)

app.get('/',(req,res)=>{
    res.json({status:"true",server:"Server is Running :"});
})

app.get('/*',(req,res)=>{
 res.status(404).json({message:"Invalid URL :"})
})

app.listen(process.env.PORT,()=>{
    console.log('Server is Running :',process.env.PORT);
})