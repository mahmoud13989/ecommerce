const express = require('express');
const bodyParser = require('body-parser'); // middleware function // form parsing logic
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth')
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products')
const cartsRouter = require('./routes/carts');
const app = express();    // app is now an object that describes all different things that our web server can do.
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true })) // applying middleware function to parsebody
app.use(cookieSession({
    keys: ['askfiuhfjdshfjdkfh']
}))


app.use(authRouter);
app.use(productsRouter);
app.use(adminProductsRouter);
app.use(cartsRouter);

app.listen(3000, () => {
    console.log('Server initiated on port 3000 ');
})



















































