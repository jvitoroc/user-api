const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const Promise = require("bluebird");

const Todo = new Schema({
    task: {type: String, required: true},
    completed: {type: Boolean, required: true, default: false},
    updated_at: {type: Date, required: true, default: Date.now},
    created_at: {type: Date, required: true, default: Date.now},
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});

// Todo.methods.invertCompleted = function(){
//     this.completed = !this.completed;
// };

Todo.statics.createTodo = function(task, userId){
    return new Promise((resolve, reject)=>{
        let todo = new this({task, user: ObjectId(userId)});
        todo.save((err, todo)=>{
            if(err)
                reject(err);
            else
                resolve(todo);
        })
    });
};

// Todo.statics.alterCompleted = function(id, userId){
//     return new Promise((resolve, reject)=>{
//         this.findOne({_id: id, user: userId}, (err, todo)=>{
//             if(err){
//                 reject(err);
//                 return;
//             }
//             todo.invertCompleted();
//             todo.save((err, todo)=>{
//                 if(err)
//                     reject(err)
//                 else
//                     resolve(todo);
//             });
//         });
//     });
// };

Todo.pre('findOneAndUpdate', function() {
    this.update({},{ $set: { updated_at: new Date() } });
});

Todo.statics.updateTodo = function(id, changes){
    return new Promise((resolve, reject)=>{
        this.findOneAndUpdate({_id: id}, changes, {new: true}, (err, todo)=>{
            if(err){
                reject(err);
                return;
            }
            if(!todo){
                reject(new Error("Todo does not exist"));
                return;
            }
            resolve(todo);
        });
    });
};

Todo.statics.deleteTodo = function(id){
    return new Promise((resolve, reject)=>{
        this.findOneAndRemove({_id: id}, (err, todo)=>{
            console.log(todo);
            if(err)
                reject(err);
            else if(!todo)
                reject('Todo does not exist');
            else
                resolve(todo);
        });
    });
}

const todo = mongoose.model('todo', Todo);

module.exports = todo;