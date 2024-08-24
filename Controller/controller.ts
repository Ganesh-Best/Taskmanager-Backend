import jwt, { JwtPayload }  from 'jsonwebtoken' 
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { Request,Response,NextFunction } from 'express'
import { ObjectId } from 'mongoose'

dotenv.config({path:'../.env'})

interface Payload {
   id?:string;
   iat?:number;
   exp?:number;
   error?:boolean;
}

interface User extends Request {
    user: Payload
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
    return {error:true}
  }

}

export const authenticate = (req: User,res: Response,next: NextFunction)=>{
 
  const token : string = req.headers.token as string 

  const payload : Payload =  decodeJwt(token);
  
  if(payload?.id ){
       
        let id: string  =   payload.id 
    // check if req user is not present then create empty user.

       if(!req.user )
         req.user = {}

    req.user.id = id;
    next(); 
    
  }else
    res.status(403)

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
