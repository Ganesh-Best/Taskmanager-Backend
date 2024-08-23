const moongoose = require('mongoose');

const userSchema  =  new moongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,required:true},
  mobile:{type:Number,required:true},
  password:{type:String,required:true, maxlength: 60},
  
})

const todoSchema = new moongoose.Schema({
    userId:{type:String,required:true},
    title:{type:String,required:true},
    description:{type: String ,required:true},
    completed:{type:Boolean,required:true}
})


const todos =  moongoose.model('todo',todoSchema);
const users =   moongoose.model('user',userSchema);
moongoose.connect(process.env.MONGODB_URL);

module.exports = {
    todos,users
}