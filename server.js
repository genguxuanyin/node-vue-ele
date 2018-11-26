const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');


const users = require('./router/api/users');
// const profiles = require('./router/api/profiles');


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(passport.initialize());

// require('./config/passport')(passport);

app.use('/api/users', users);
// app.use('/api/profiles', profiles);

require('./db/connect');

const port = process.env.port || 5000;

app.get('/', (req, res) => {
    res.send('hello world!');
});

app.listen(port, (req, res) => {
    console.log(`Server started on ${port}`);
});