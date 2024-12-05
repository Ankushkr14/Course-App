const express = require('express')
const { mongoose } = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { userRoute } = require('./routes/user');
const { coursesRoute } = require('./routes/courses');
const { adminRoute } = require('./routes/admin')

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());


app.use('/admin', adminRoute);
//Login
app.use('/user', userRoute);
//courses
app.use('/courses',coursesRoute);
//admin


async function main(){
    try{
        await mongoose.connect(process.env.DATABASE_URL);
        app.listen(process.env.PORT,()=>{
            console.log("Server is running...")
        })
    }catch(error){
        console.log(error);
    }
}
main()