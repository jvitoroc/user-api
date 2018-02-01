
// initialize env vars
require("./env")();

const express = require('express');
const app = express();
const passport = require('./overloaders/passport');
const mongoose = require('./overloaders/mongoose/index');
const bodyParser = require('body-parser');
const jwt = require("jwt-simple");
const _ = require("lodash");

const user = require("./controllers/user");

mongoose.connect('todoapp', '27017')
    .then(()=>{
        // Connected
        console.log("MongoDB connected");
    })
    .catch((err)=>{
        // Error, not connected
        console.log(err);
    });

// Express middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

app.set('views', './views');

app.get("/", function(req, res) {
    res.json({message: "Express is up!"});
});

// User routes
app.post("/login", user.login);
app.post("/create", user.create);
app.get("/activate/:token", user.activate);

app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
    res.json("Success! You can not see this without a token");
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));