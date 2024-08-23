const jwt  = require('jsonwebtoken');
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


module.exports = {
   generateJwt ,decodeJwt,authenticate
}