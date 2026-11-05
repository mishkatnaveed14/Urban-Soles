const path = require('path')
const express = require('express')
const products = require('./src/data/products.json')
const app = express()
const port = 8000

function queryString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

// set  veiw engine 
app.set('view engine','ejs')
app.set('views', path.join(__dirname ,'views'))
// static files
app.use(express.static(path.join(__dirname, 'public')))
// ------------------- ROUTES -------------------
app.get('/',(req,res)=>{
res.render('pages/home', { products })
})
app.get('/cart',(req,res)=>{
res.render('pages/cart')
})
app.get('/checkout',(req,res)=>{
res.render('pages/checkout')
})
app.get('/product-detail',(req,res)=>{
const product = products.find((item) => item.id === queryString(req.query.product))
res.status(product ? 200 : 404).render('pages/product-detail', { product })
})
app.get('/shop',(req,res)=>{
const search = queryString(req.query.search)
const category = queryString(req.query.category)
const type = queryString(req.query.type)
const sort = queryString(req.query.sort)
const max = Number(queryString(req.query.max))
const sale = queryString(req.query.sale) === 'true'
const searchTerm = search.toLowerCase()

const filteredProducts = products.filter((product) => {
  const matchesSearch = !searchTerm || `${product.name} ${product.category} ${product.type} ${product.tag}`.toLowerCase().includes(searchTerm)
  const matchesCategory = !category || product.category.toLowerCase() === category.toLowerCase()
  const matchesType = !type || product.type.toLowerCase() === type.toLowerCase()
  const matchesMax = !Number.isFinite(max) || max <= 0 || product.price <= max
  const matchesSale = !sale || product.isSale
  return matchesSearch && matchesCategory && matchesType && matchesMax && matchesSale
})

if (sort === 'new') filteredProducts.sort((a, b) => Number(b.isNew) - Number(a.isNew))
if (sort === 'popular') filteredProducts.sort((a, b) => b.popularity - a.popularity)
if (sort === 'price-low') filteredProducts.sort((a, b) => a.price - b.price)
if (sort === 'price-high') filteredProducts.sort((a, b) => b.price - a.price)

res.render('pages/shop', {
  products: filteredProducts,
  search,
  category,
  type,
  sort,
  max: Number.isFinite(max) && max > 0 ? max : '',
  sale,
})
})
app.get('/my-cart',(req,res)=>{
res.redirect('/cart')
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
