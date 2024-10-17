const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
    requireTitle: check('title')
        .trim()
        .isLength({ min: 5, max: 40 })
        .withMessage('must be between  5 and 50 characters')
    ,
    requirePrice: check('price')
        .trim()
        .toFloat()
        .isFloat({ min: 1 })
        .withMessage('must be with number greater than one')
    ,
    requireEmail: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be valid Email')
        .custom(async (email) => {
            const existingUser = await usersRepo.getOneBy({ email });
            if (existingUser)
                throw new Error('Email in use !')
        }),
    requirePassword: check('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password Must be between 4 and 20 characters'),
    requirePasswordConfirmation: check('passwordConfirmation')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password Must be between 4 and 20 characters')
        .custom((passwordConfirmation, { req }) => {
            if (passwordConfirmation !== req.body.password)
                return true;
            else {
                throw new Error('Password Must Match!')
            }
        }),
    requireEmailExist:
        check('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage('Must Provide a valid Email')
            .custom(async (email) => {
                const user = await usersRepo.getOneBy({ email })
                if (!user) {
                    throw new Error('Email not found !')
                }
            }),
    requireValidPasswordForUser:
        check('password')
            .trim()
            .custom(async (password, { req }) => {
                const user = await usersRepo.getOneBy({ email: req.body.email })
                if (!user) {
                    throw new Error('invalid password');
                }
                const validPassword = await usersRepo.comparePasswords(user.password, password);
                if (!validPassword) {
                    throw new Error('invalid password');
                }
            })

};