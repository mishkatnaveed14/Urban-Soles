const express = require('express')
const app = express()
const port = 8000
app.set('view engine','ejs')
app.get('',(res,req)=>{
    res.render('/','{}')
})



app.send(port,()=>{
    console.log(`server is running on ${port}`)
})