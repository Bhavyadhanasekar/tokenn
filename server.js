const routes = require('./routes/routes');
const mongoose=require('mongoose')
const jwt = require('jsonwebtoken'); // Corrected variable name
const jwtSecret = process.env.JWT_SECRET;
const express = require('express');
const app = express();


mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/VLP');
const db = mongoose.connection;

db.on('error', (err) => {
    console.log(err);
});

db.once('open', () => {
    console.log("DB Connected Successfully");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.use(function (req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, function (err, decode) {
            if (err) req.user = undefined;
            req.user = decode;
            next();
        });
    } else {
        req.user = undefined;
        next();
    }
});

app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' });
});

app.listen(3209, function check(error) {
    if (error)
        console.log('Error in Starting the port');
    else
        console.log('port Started');
});