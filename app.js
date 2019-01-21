const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('express-flash');

//Connect to database
mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true });
let db = mongoose.connection;

//Checking for connections to Mongodb
db.once('open',()=>{
    console.log('Connected to MongoDB');
});

//Check for DB errors
db.on('error', (error)=>{
    console.log(error)
});

//Init App
const app = express();

//Bring in Models
let Article = require('./models/article');
// let User = require('./models/users');

//Load view engine
app.engine('.html', exphbs({defaultLayout: 'index', extname: 'html'}));
app.set('view engine', 'html');

//Body-Parser
app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());

//Set Public folder static
app.use(express.static(path.join(__dirname,'public')));

//Session Middleware 
app.use(session({secret: 'keyboard cat',resave: false, saveUninitialized: false}));

// Flash Middleware
app.use(flash());

//Home Route
app.get('/',(req,res)=>{

    if(req.session.email){
        
        Article.find({}, (err, article) => {
            if (err) {
                console.log(err);
            } else {
                res.render('home', {
                    article_data: article,
                    check: true
                });
            }
        }); 
    }else{
        res.redirect('/users/login');
    }
});

//route files
let article_router = require('./routes/article_router');
let user_router = require('./routes/user_router');
app.use('/article', article_router);
app.use('/users', user_router);

//App is listining
app.listen(3000,()=>{
    console.log('SERVER AT 3000');
});