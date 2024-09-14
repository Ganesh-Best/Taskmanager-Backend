import jwt, { JwtPayload }  from 'jsonwebtoken' 
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { Request,Response,NextFunction } from 'express'
import { ObjectId } from 'mongoose'
import {z} from 'zod';

dotenv.config({path:'../.env'})

interface Payload {
   id?:string;
   iat?:number;
   exp?:number;
   error?:boolean;
}

export interface newRequest extends Request {
    user?: Payload
}

export interface User extends Document {
  _id: ObjectId,
  name:string;
  email:string;
  mobile:number;
  isVerify:boolean;
  password:string;
}

interface Mail {
  from: string;
    to: string;
    subject: string;
    html:string;

}

export const generateJwt = (payload: ObjectId ): string =>{

     let SECRET_KEY: string  =  process.env.SECRET_KEY as string 
    
      const token : string  =  jwt.sign({id:payload},SECRET_KEY,{ expiresIn:'1d' })
     
    return  `Bearer ${token}`    
  }

export const decodeJwt =  (cipher: String): Payload  =>{
  const token   =  cipher.split(' ')[1]
  try {
    let SECRET_KEY: string = process.env.SECRET_KEY as string 

    // const payload: JwtPayload | string  = jwt.verify(token,SECRET_KEY);   
 
    const decoded: Payload =  jwt.verify(token,SECRET_KEY) as Payload; 
   
    return decoded
      
  }catch(e){
    console.log('Catch fucntion get call :')
    return {error:true}

  }

}

export const authenticate = (req: newRequest,res: Response,next: NextFunction):void =>{
 
  const token : string|undefined = req.headers.token as string ;
  
  if(!token)
  res.status(401).json({message:"unauthorized Request :"});
  else{
  const payload : Payload =  decodeJwt(token);
    console.log('payload after decodeJwt:',payload)

  if(payload?.id ){
       
        let id: string  =   payload.id 
    // check if req user is not present then create empty user.

       if(!req.user )
         req.user = {}

    req.user.id = id;
    next(); 
    
  }else
    res.status(403).json({message:"forbidden"})
  }
}

//It will sent mail to 
export const verifyMail = (name : String,email: String,userId: ObjectId)=>{

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure:false,
    requireTLS:true,
    auth:{
      user:process.env.SENDER,
      pass:process.env.PASS
    }
   })

  const mailOptions = {
    from: process.env.SENDER,
    to: email,
    subject: `Verify your email ${name}`,
    html:`<p>Hi ${name} , <br/> Please click  <a href=${process.env.BACKEND}/auth/verify?id=${userId}> Here </a> to verify your email address  <br/> Best Regards , <br/> todos team  </p>`
  } 

  transporter.sendMail(mailOptions as Mail,(error,response)=>{
    
    if(error)
      return console.log('unable to send mail' ,error)

    console.log('mails has been sent',response)

  })

}
