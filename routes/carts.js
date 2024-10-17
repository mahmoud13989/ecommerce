const express = require('express');
const router = express.Router();
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products')
const cartShowTemplate = require('../views/cart/show')
// Receive a post request to add an item to a cart
router.post('/cart/products/', async (req, res) => {
    let cart;
    if (!req.session.cartId) {
        // we  dont have a cart , we need to create one, 
        // and store the cart id on req.session.cartId
        // property
        cart = await cartsRepo.create({ items: [] })
        req.session.cartId = cart.id;
        console.log(req.session)
    }
    
    else {
        //we have a cart lets get it from repository
        cart = await cartsRepo.getOne(req.session.cartId)
    }
    
    const existingItem = cart.items.find( item => item.id === req.body.productId)
    
    if (existingItem) {
        //increment quantity and save cart
        existingItem.quantity++;
    }
    else {
        // add new product id to items array
        cart.items.push({ id: req.body.productId, quantity: 1 })
    }
    await cartsRepo.update(cart.id , {items: cart.items} )
    
    
    res.redirect('/cart')
})    


// Receive a get request to show all items in cart

router.get('/cart', async ( req ,res )=> {
        if (!req.session.cartId){
            return res.redirect('/');
        }
        console.log(req.session.cartId)
        const cart = await cartsRepo.getOne(req.session.cartId);
        // item : [{id: 'as$@sda' , quantity : 4 , product :{ all about the prodcut just for easy access}      }]
        for (let item of cart.items){
            const product = await productsRepo.getOne(item.id);
            item.product = product;
        }
        res.send(cartShowTemplate( {items : cart.items} ))
})


//Receive a post request to delete an item form a cart

router.post('/cart/products/delete', async (req , res)=>{
   const  {itemId}  = req.body;
   const cart = await cartsRepo.getOne(req.session.cartId);

   const items = cart.items.filter ( item => item.id !== itemId)
   await cartsRepo.update( req.session.cartId , {items: items})
    res.redirect ('/cart')
})




module.exports = router;
