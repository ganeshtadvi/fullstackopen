import express from 'express'
import app from './app.js'

import config from './utils/config.js'




const PORT=config.PORT
app.listen(PORT,(err)=>{
    if(!err){
        console.log("Server runs on port: ",PORT)
    }
    else{
        console.log("Server Not started,",err)
    }
})

