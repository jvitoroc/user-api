const nodemailer = require("nodemailer");
const Promise = require("bluebird");
const mg = require('nodemailer-mailgun-transport');
const jwt = require("jwt-simple");
const {URL} = require('url');
const jwtSecret = process.env.JWTSECRET;

const auth = {
    auth: {
           api_key: process.env.MAILGUNAPIKEY,
           domain: process.env.MAILGUNDOMAIN
    },
};

const transporter = nodemailer.createTransport(mg(auth));

const mailOptions = {
    from: 'lopogax@gmail.com',
    subject: 'Confirm your account'
};

module.exports.sendActivationLink = function(to, user){
    let payload = {
        id: user._id,
    };
    token = jwt.encode(payload, jwtSecret);

    let url = (new URL(`http://localhost:3000/activate/${token}`)).toString();
    
    to = `${user.username} <${to}>`;

    let newOptions = {...mailOptions, to};
        newOptions.html = `<p>Click <a href="${url}">here</p>`;
        newOptions.text = `${url}`;

    return new Promise((resolve, reject)=>{
        transporter.sendMail(newOptions, function(err, info){
            if(err){
                reject(err);
                return;
            }
            resolve(info);
        });
    });
}