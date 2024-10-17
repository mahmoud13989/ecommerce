const express = require('express');
const { handleErrors } = require('./middlewares.js');

const router = express.Router();
const usersRepo = require('../../repositories/users.js')
const signupTemplate = require('../../views/admin/auth/signup.js');
const signinTemplate = require('../../views/admin/auth/signin.js')
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExist, requireValidPasswordForUser } = require('./validators.js')
router.get('/signup',
    (req, res) => {
        res.send(signupTemplate({ req }));
    });
router.post('/signup',
    [requireEmail, requirePassword, requirePasswordConfirmation], 
    handleErrors(signupTemplate),
    async (req, res) => {
        const { email, password } = req.body;
        const newUser = await usersRepo.create({ email, password });
        req.session.userId = newUser.id;
        res.redirect('/admin/products')
    })
router.get('/signout',
    (req, res) => {
        req.session = null;
        res.send('You are logged out')
    })

router.get('/signin',
    (req, res) => {
        res.send(signinTemplate({}));
    })
router.post('/signin',
    [requireEmailExist, requireValidPasswordForUser],
    handleErrors(signinTemplate),
    async (req, res) => {
        const { email } = req.body;
        const user = await usersRepo.getOneBy({ email })
        req.session.userId = user.id;
        res.redirect('/admin/products')
    })
module.exports = router;


