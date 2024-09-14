import express,{Request,Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
const app = express();
dotenv.config();
import authRoute from './Routes/auth'
import todoRoute from './Routes/todo'

app.use(cors({
    origin: '*'
}))


app.use(express.json())

app.use('/auth',authRoute);

app.use('/todo',todoRoute);


app.get('/',(req : Request,res:Response)=>{
    res.json({status:"true",server:"Server is Running :"});
})

app.get('/*',(req: Request,res: Response)=>{
 res.status(404).json({message:"Invalid URL :"})
})

app.listen(process.env.PORT,()=>{
    console.log('Server is Running :',process.env.PORT);
})