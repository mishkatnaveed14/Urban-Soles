const express = require('express')
const app = express()
const port = 8000
// set  veiw engine 
app.set('view engine','ejs')
app.set('views', path.join(__dirname ,'views'))
// static files
app.use(express.static(path.join(__dirname, 'public')))
// ------------------- ROUTES -------------------
app.get('/',(req,res)=>{
res.render()
})

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})
