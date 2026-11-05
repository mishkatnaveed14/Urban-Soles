const path = require('path')
const express = require('express')
const app = express()
const port = 8000
const products = [
  { id: 'velocity-runner', name: 'Velocity Runner', category: 'Men', type: 'running', price: 12500, tag: 'Bestseller', isNew: true, isSale: false, popularity: 10 },
  { id: 'street-low', name: 'Street Low', category: 'Men', type: 'sneakers', price: 9800, tag: 'Everyday', isNew: false, isSale: true, popularity: 9 },
  { id: 'cloud-walker', name: 'Cloud Walker', category: 'Women', type: 'running', price: 13900, tag: 'Lightweight', isNew: true, isSale: false, popularity: 8 },
  { id: 'court-classic', name: 'Court Classic', category: 'Women', type: 'casual', price: 11200, tag: 'Classic', isNew: false, isSale: true, popularity: 7 },
  { id: 'mini-sprint', name: 'Mini Sprint', category: 'Kids', type: 'sports', price: 7200, tag: 'Kids', isNew: true, isSale: false, popularity: 6 },
  { id: 'daily-canvas', name: 'Daily Canvas', category: 'Men', type: 'casual', price: 8500, tag: 'Casual', isNew: false, isSale: false, popularity: 5 },
  { id: 'stride-pro', name: 'Stride Pro', category: 'Women', type: 'sports', price: 15900, tag: 'Performance', isNew: true, isSale: true, popularity: 4 },
  { id: 'school-ready', name: 'School Ready', category: 'Kids', type: 'school', price: 6500, tag: 'School', isNew: false, isSale: false, popularity: 3 },
]

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
