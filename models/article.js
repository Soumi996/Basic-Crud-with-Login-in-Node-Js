let mongoose = require('mongoose');

//Article Schema

let articleSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        requird: true
    },
    body:{
        type: String,
        requird: true
    },
    author_id:{
        type: String,
        requird: true
    }
});

let Article = mongoose.model('articles',articleSchema);

module.exports = Article;

