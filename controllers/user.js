const User = require("../models/user");
const jwt = require("jwt-simple");
const expirationTime = process.env.JWTEXPIRATION;
const jwtSecret = process.env.JWTSECRET;
const nodemailer = require("../overloaders/nodemailer");

module.exports = {
    login: (req, res) => {
        if(req.body.username && req.body.password){
            var username = req.body.username;
            var password = req.body.password;
        }

        User.authenticate(username, password)
            .then((userId)=>{
                let payload = {
                    id: userId,
                    expiration_date: Date.now() + Number(expirationTime)
                };
                let token = jwt.encode(payload, jwtSecret);
                res.status(202);
                res.json({message: "Authenticated", token: token});
            })
            .catch((err)=>{
                console.log(err);
                res.status(401);
                res.json({message: "Not authenticated", error: err});
            })
    },
    
    create: (req, res) => {
        if(req.body.username && req.body.password && req.body.email){
            var username = req.body.username;
            var password = req.body.password;
            var email = req.body.email;
        }

        User.createUser(username, password, email)
            .then((user)=>{
                nodemailer.sendActivationLink(email, user)
                    .then((info)=>{
                        //console.log("sent", info);
                    })
                    .catch((err)=>{
                        //console.log("not sent", err);
                    });
                res.status(201);
                res.json({message: 'User created'});
            })
            .catch((err)=>{
                res.status(500);
                res.json({message: 'User not created', error: err});
            });
    },
    // "/activate/{token}"
    activate: (req, res) => {
        if(req.params.token){
            let id;
            try{
                id = jwt.decode(req.params.token, jwtSecret).id;
            }catch(e){
                res.status(400);
                res.json({message: 'Invalid token', error: e});
                return;
            }

            User.activate(id)
                .then((user)=>{
                    res.json({message: `The account ${user.username} was activated`});
                })
                .catch((err)=>{
                    res.status(500);
                    res.json({message: 'An error occurred trying to activate the user', error: err});
                });
        }
    }
}