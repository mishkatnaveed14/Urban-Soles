const path = require('path')
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
res.render('pages/home')
})
app.get('/cart',(req,res)=>{
res.render('pages/cart')
})
app.get('/checkout',(req,res)=>{
res.render('pages/checkout')
})
app.get('/product-detail',(req,res)=>{
res.render('pages/product-detail')
})
app.get('/shop',(req,res)=>{
res.render('pages/shop')
})
app.get('/my-cart',(req,res)=>{
res.render('pages/my-cart')
})
// AUTH
app.get('/login',(req,res)=>{
res.render('auth/login')
})
app.get('/signup',(req,res)=>{
res.render('auth/signup')
})
// ADMIN ROUTES
app.get('/dashboard',(req,res)=>{
res.render('admin/dashboard')
})
app.get('/orders',(req,res)=>{
res.render('admin/orders')
})
app.get('/product',(req,res)=>{
res.render('admin/product')
})



app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})
