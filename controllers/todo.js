const Todo = require("../models/todo");

module.exports = {
    // /todo
    create: (req, res)=>{
        if(req.body.task){
            var task = req.body.task;
        }
        Todo.createTodo(task, req.user._id)
            .then((todo)=>{
                res.status(201);
                res.json({todo, message: 'Todo created'});
            })
            .catch((err)=>{
                res.json({error: err, message: 'Todo not created'});
            });
    },

    // /todo/{id}
    update: (req, res)=>{
        let changes = {};
        let {task, completed} = req.body;

        if(task || completed){
            if(task)
                changes.task = req.body.task;
            if(completed)
                changes.completed = req.body.completed;
        }else{
            res.status(401).json({message: 'Bad request'});
            return;
        }
            
        Todo.updateTodo(req.params.id, changes)
            .then((todo)=>{
                res.status(200);
                res.json({todo, message: 'Todo updated'})
            })
            .catch((err)=>{
                res.json({error: err.message, message: 'Todo not updated'});
            });
    },

    // /todo/{id}
    delete: (req, res)=>{
        
        Todo.deleteTodo(req.params.id)
            .then((todo)=>{
                res.json({message: 'Todo deleted'});
            })
            .catch((err)=>{
                res.json({error: err, message: 'Todo not deleted'});
            });
    }
}