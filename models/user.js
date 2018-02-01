const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Promise = require("bluebird");

const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    activated: {type: Boolean, required: true, default: false},
    email: {type: String, required: true, unique: true}
});

UserSchema.plugin(uniqueValidator);

UserSchema.statics.authenticate = function(username, password) {
    return new Promise((resolve, reject)=>{
        this.findOne({username: username}, function(err, user){
            if(err)
                reject(err);
            else if(!user)
                reject(new Error("User not found"));
            else if(!user.activated)
                reject(new Error("Account not activated"));
            else
                bcrypt.compare(password, user.password, function(err, res) {
                    if(err){
                        reject(err);
                        return;
                    }else if(res){
                        resolve(user._id);
                        return;
                    }else
                        reject(new Error('Password doesn\'t match'));
                });
        });
    });
};

UserSchema.statics.createUser = function(username, password, email) {
    return new Promise((resolve, reject)=>{
        let user = new this();
        user.username = username;
        user.email = email;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err)
                return reject(err);
            bcrypt.hash(password, salt, function(err, hash) {
                if(err)
                    return reject(err);
                user.password = hash;
                user.save((err, createdUser)=>{
                    if(err)
                        return reject(err);
                    resolve(createdUser);
                });
            });
        });
    });
};

UserSchema.statics.activate = function(id){
    return new Promise((resolve, reject)=>{
        this.findOneAndUpdate({_id: id}, {activated: true}, (err, user)=>{
            if(err)
                reject(err);
            else
                resolve(user);
        });
    });
}

const User = mongoose.model('User', UserSchema);

module.exports = User;