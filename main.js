// imports

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
// const bodyParser = require('body-parser');
// const MongoStore = require('connect-mongo');
const app = express();

const PORT = process.env.PORT || 4000;

//db Connection

mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on('error', (err) => {
    console.log(err);
});

db.once('open', () => {
    console.log('Database connected');
});


//middlewares

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use((req,res,next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});


// static files 

app.use(express.static('uploads'));

//set template engine

app.set('view engine', 'ejs');

// route prefix

app.use('', require('./routes/routes'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
