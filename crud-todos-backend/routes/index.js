var express = require('express');
var router = express.Router();
var sqlite = require("better-sqlite3");
const db = new sqlite('database.db');

router.get('/todos', function (req, res, next) {
  try {
    const todos = db.prepare("SELECT * FROM todos").all();
    res.json({ todos: todos });
  } catch (err) {
    next(err);
  }
});

router.post('/todos', function (req, res, next) {
  try {
    db.prepare('INSERT INTO todos (task) VALUES (?)').run(req.body.task);
    res.status(201).json({});
  } catch (err) {
    next(err);
  }
});

router.put('/todos', function (req, res, next) {
  try {
    console.log(req.body);
    db.prepare('UPDATE todos SET task = ? WHERE id = ?').run(req.body.task, req.body.todo_id);
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
});

router.delete('/todos', function (req, res, next) {
  try {
    db.prepare('DELETE FROM todos WHERE id = ?').run(req.body.todo_id);
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
});

module.exports = router;