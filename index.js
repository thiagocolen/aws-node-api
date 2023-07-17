const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Create a new Express app
const app = express();

// Configure body parser
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/todolist');

// Create a new model called `Todo`
const TodoSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean
});

const Todo = mongoose.model('Todo', TodoSchema);

// Create a new route to get all todos
app.get('/todos', (req, res) => {
  Todo.find({}, (err, todos) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(todos);
    }
  });
});

// Create a new route to create a new todo
app.post('/todos', (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    description: req.body.description,
    completed: false
  });

  todo.save((err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(todo);
    }
  });
});

// Create a new route to update a todo
app.put('/todos/:id', (req, res) => {
  const id = req.params.id;

  Todo.findById(id, (err, todo) => {
    if (err) {
      res.status(500).send(err);
    } else if (!todo) {
      res.status(404).send('Todo not found');
    } else {
      todo.title = req.body.title;
      todo.description = req.body.description;
      todo.completed = req.body.completed;

      todo.save((err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send(todo);
        }
      });
    }
  });
});

// Create a new route to delete a todo
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;

  Todo.findByIdAndDelete(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send('Todo deleted');
    }
  });
});

// Start the Express server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});