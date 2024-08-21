const jwt  = require('jsonwebtoken');
require('dotenv').config({path:'../.env'})

export const generateJwt = (payload)=>{

     let token =  jwt.sign({payload},process.env.SECRET_KEY,{ expiresIn:'1h' })
     
    return  `Bearer ${token}`;

  }

export const decodeJwt = (cipher)=>{
  const token   =  cipher.split(' ')[1]
  try {
    
    const payload =  jwt.verify(token,process.env.SECRET_KEY);    
    return payload
    
  } catch (error) {
    return null 
  }
}

export const authenticate = (req,res,next)=>{
 
  const { token } = req.headers;

  const payload =  decodeJwt(token);

  if(payload){
    next(); 
  }else
    res.status(403)

}
