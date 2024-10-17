const express = require('express');
const productsRepo = require('../repositories/products')
const productsIndexTemplate = require('../views/products')
const router = express.Router();

router.get('/', async (req, res) => {
    console.log('sdfdsf')
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({ products }))
})


module.exports = router;