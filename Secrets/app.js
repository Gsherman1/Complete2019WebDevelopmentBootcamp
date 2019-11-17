const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');


const app = express();


app.set('view engine', 'ejs');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const secret = 'Thisisourlittlescret.';
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});


const User = new mongoose.model('User', userSchema);


app.route('/').get((req, res) => {
    res.render('home');
});


app.route('/login').get((req, res) => {
    res.render('login');
});


app.route('/register').get((req, res) => {
    res.render('register');
});


app.listen(3000, function() {
    console.log("Server started on port 3000");
});


app.route('/register').post((req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render('secrets');
        }
    });

});


app.route('/login').post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render('secrets');
                }
            }
        }
    });
});