
const bcrypt = require('bcrypt');


const hashing = async (password)=>{

    const hashPass =   await bcrypt.hash(password,10);
 
   console.log('type of hash' ,typeof(hashPass))

  const match = await bcrypt.compare('12345','$2b$10$u.dSTvz9V71Y75hWWOLlvejj01wJXHbW4i63wTf1p7g9Ao1iYZQPe');
  console.log(match)
  if(match)
    console.log('Password match , login successful');

}

hashing("12345")