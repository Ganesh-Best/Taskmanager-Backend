import moongoose, { Error } from 'mongoose';

 const userSchema  =  new moongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,required:true},
  mobile:{type:Number,required:true},
  isVerify:{type:Boolean,required:true},
  password:{type:String,required:true, maxlength: 60},

})

const todoSchema = new moongoose.Schema({
    userId:{type:String,required:true},
    title:{type:String,required:true},
    description:{type: String ,required:true},
    completed:{type:Boolean,required:true}
})


export const todos =  moongoose.model('todo',todoSchema);
export const  users =   moongoose.model('user',userSchema);


if(process.env.MONGODB_URL)
 moongoose.connect(process.env.MONGODB_URL);
else
 throw new Error("MONGODB_URL is not defined ");