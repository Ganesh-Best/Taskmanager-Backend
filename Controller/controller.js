const jwt  = require('jsonwebtoken');
const nodemailer = require('nodemailer');

require('dotenv').config({path:'../.env'})

const generateJwt = (payload)=>{

     let token =  jwt.sign({payload},process.env.SECRET_KEY,{ expiresIn:'1d' })
     
    return  `Bearer ${token}`;

  }

const decodeJwt = (cipher)=>{
  const token   =  cipher.split(' ')[1]
  try {
    
    const payload =  jwt.verify(token,process.env.SECRET_KEY);    
    return payload
    
  } catch (error) {
    return null 
  }
}

 const authenticate = (req,res,next)=>{
 
  const { token } = req.headers;

  const {payload} =  decodeJwt(token);
  if(payload){
      
    // check if req user is not present then create empty user.

       if(!req.user)
         req.user = {}

    req.user.id = payload;
    next(); 
    
  }else
    res.status(403)

}

//It will sent mail to 
const verifyMail = (name,email,userId)=>{

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

  transporter.sendMail(mailOptions,(error,response)=>{
    
    if(error)
      return console.log('unable to send mail' ,error)

    console.log('mails has been sent',response)

  })

}


module.exports = {
   generateJwt ,decodeJwt,authenticate,verifyMail
}