const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

//Bring in Models
let Article = require('../models/article');

//Article Route
router.get('/add', (req, res) => {
    if (req.session.email) {
        res.render('add_article', {
            title: 'Add Articles',
            check: true
        });
    }else{
        res.redirect('/');
    }
});

//Single Article
// :id is a placeholder
router.get('/:id', (req, res) => {
   if(req.session.email){
       Article.findById(req.params.id, (err, article) => {
           if (err) {
               console.log(err);
           }else{
            //    console.log('Session : ', req.session.auth_id);
            //    console.log('Author : ',article.author_id);
               if (req.session.auth_id == article.author_id){
                   res.render('article', {
                       article_data: article,
                       check: true,
                       owner: true
                   });
               }else{
                   res.render('article', {
                       article_data: article,
                       check: true,
                       owner: false
                   });

               }               
           }
       });
   }else {
       res.redirect('/');
   }
});

//Load edit form
router.get('/edit/:id', (req, res) => {
    if (req.session.email) {
        Article.findById(req.params.id, (err, article) => {
            if (err) {
                console.log(err);
            }
            res.render('edit_article', {
                article_data: article,
                check: true
            });
        });
    }else{
        res.redirect('/');
    }
});

//Update Post Route
router.post('/edit/:id', (req, res) => {

    let query = { _id: req.params.id };
    // console.log(req.body);

    Article.updateOne(query, req.body, (err) => {
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Article Updated');
            res.redirect('/');
        }
    });
});

router.post('/delete/:id', function (req, res) {

    Article.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Article Deleted');
            res.redirect('/');
        }
    });
});

//Submit Post Route
//Create New Article
router.post('/add', [
    check('author', 'VALID AUTHOR REQUIRED (I ASKED AN EMAIL)').isEmail(),
    check('title', 'HEY GIVE A PROPER TITLE FIRST').isLength({ min: 5 }),
    check('body', 'HEY BE CREATIVE MAN TAKE A BREATH AND WRITE SOMETHING FRESH (100 MIN WORDS)').isLength({ min: 100 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // console.log(errors.mapped());
        res.render('add_article', {
            errors: errors.mapped()
        })
    } else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;
        article.author_id = req.session.auth_id;

        console.log(article);

        article.save((err) => {
            if (err) {
                console.log(err);
            } else {
                req.flash('success', 'Article Added');
                res.redirect('/');
            }
        });
    }

});


module.exports = router;