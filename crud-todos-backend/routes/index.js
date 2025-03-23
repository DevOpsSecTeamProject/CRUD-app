var express = require('express');
var router = express.Router();
var sqlite = require("better-sqlite3");

const db = new sqlite('database.db', { verbose: console.log });

db.prepare(`
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task VARCHAR(255)
    )
`).run();

router.post('/', function (req, res, next) {
    try {
        console.log("Received POST request with task:", req.body.task);
        const stmt = db.prepare('INSERT INTO todos (task) VALUES (?)');
        const result = stmt.run(req.body.task);
        console.log("Task inserted successfully with id:", result.lastInsertRowid);
        res.status(201).json({});
    } catch (err) {
        console.error("Error inserting task:", err.message);
        res.status(500).json({ error: "Failed to insert task" });
    }
});

router.get('/', function (req, res, next) {
    try {
        console.log("Fetching todos from database...");
        const todos = db.prepare("SELECT * FROM todos").all();
        console.log("Todos fetched:", todos);
        res.json({ todos });
    } catch (err) {
        console.error("Error fetching todos:", err.message);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});

router.put('/', function (req, res, next) {
    try {
        const { todo_id, task } = req.body;
        console.log("Received PUT request with body:", { todo_id, task });
        const stmt = db.prepare('UPDATE todos SET task = ? WHERE id = ?');
        const result = stmt.run(task, todo_id);
        if (result.changes === 0) {
            console.log("No task updated, possibly invalid id:", todo_id);
            return res.status(404).json({ error: "Task not found" });
        }
        console.log("Task updated successfully for id:", todo_id);
        res.status(204).json({});
    } catch (err) {
        console.error("Error updating task:", err.message);
        res.status(500).json({ error: "Failed to update task" });
    }
});

router.delete('/', function (req, res, next) {
    try {
        const todoId = req.body.data ? req.body.data.todo_id : req.body.todo_id;
        console.log("Received DELETE request with todo_id:", todoId);
        const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
        const result = stmt.run(todoId);
        if (result.changes === 0) {
            console.log("No task deleted, possibly invalid id:", todoId);
            return res.status(404).json({ error: "Task not found" });
        }
        console.log("Task deleted successfully for id:", todoId);
        res.status(204).json({});
    } catch (err) {
        console.error("Error deleting task:", err.message);
        res.status(500).json({ error: "Failed to delete task" });
    }
});

module.exports = router;