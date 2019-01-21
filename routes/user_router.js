const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

//Bring in Models
let User = require('../models/users');


router.get('/register',(req, res)=>{
    if (!req.session.email) {
        res.render('register', {
            title: 'REGISTER YOURSELF'
        });
    }else{
        res.redirect('/');
    }
});

router.get('/login', (req, res) => {
    if (!req.session.email) {
        res.render('login', {
            title: 'LOGIN'
        });
    }else{
        res.redirect('/');
    }
});

router.get('/logout', (req, res) => {
    if (!req.session.email) {
        res.render('login', {
            title: 'LOGIN'
        });
    } else {
        req.session.destroy();
        res.redirect('/');
    }
});

router.post('/login', (req, res) => {
    let query = { email: req.body.email};
    User.findOne(query, (err, result)=>{
        try {
            if (result.email == req.body.email && result.password == req.body.password) {
                req.session.email = req.body.email;
                req.session.password = req.body.password;
                req.session.auth_id = result.id;
                // console.log(req.session.auth_id);
                // console.log(result.id);
                req.flash('login', 'WELCOME', result.username);
                res.redirect('/');
            }
        } catch (error) {
            req.flash('loginfail', 'CHECK USERNAME AND PASSWORD');
            res.redirect('/users/login');
        }
    })
});

router.post('/register', [
    check('name','HEY YOU SHOULD HAVE A NAME'),
    check('username','HEY YOU SHOULD HAVE A USERNAME OF ATLEAST 7 LETTER LONG').isLength({ min: 7 }),
    check('email','COMMON MAN GIVE A PROPER EMAIL').isEmail()
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // console.log(errors.mapped());
        res.render('register', {
            errors: errors.mapped()
        });
    } else {
        let query = { email: req.body.email};
        User.findOne(query, (err, result)=>{
            try {
                if (err) {
                    return next(err); 
                } else if (result.email == req.body.email) {
                        req.flash('registerfail', 'EMAIL ALREADY EXIST TRY ANOTHER');
                        res.redirect('/users/register');
                }
            } catch (error) {
                let user = new User(req.body);
                user.save((err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        req.flash('registersuccess', 'YOU ARE REGISTERED NOW LOGIN');
                        res.redirect('/users/login');
                    }
                });
            }
        })
    }

});

module.exports = router;