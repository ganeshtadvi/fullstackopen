import express from 'express'
import mongoose from 'mongoose'
import config from './utils/config.js'
import blogsRouter from './controllers/blogs.js'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'


const app=express()

app.use(express.json())

mongoose.connect(config.MONGODB_URI,{family:4}).then(()=>{
    console.log("Mongoose Connected....")
})

app.use('/api/blogs',blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users',usersRouter)

app.get('/',(req,res)=>{
    res.send("Welcome To Home")
})













export default app