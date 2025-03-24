var express = require('express');
var router = express.Router();
var sqlite = require("better-sqlite3");

const db = new sqlite('database.db', { verbose: console.log }, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

try {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task VARCHAR(255) NOT NULL
        )
    `).run();
    console.log('Todos table created or already exists');
} catch (err) {
    console.error('Error creating table:', err.message);
}

router.post('/', function (req, res, next) {
    try {
        const task = req.body.task;
        if (!task || typeof task !== 'string') {
            console.log("Invalid task in POST request:", req.body.task);
            return res.status(400).json({ error: "Task is required and must be a string" });
        }
        console.log("Received POST request with task:", task);
        db.prepare('INSERT INTO todos (task) VALUES (?)').run(task);
        console.log("Task inserted successfully");
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
        res.json({ todos: todos });
    } catch (err) {
        console.error("Error fetching todos:", err.message);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});

router.put('/', function (req, res, next) {
    try {
        const task = req.body.task;
        const todoId = req.body.todo_id;
        if (!task || typeof task !== 'string') {
            console.log("Invalid task in PUT request:", req.body.task);
            return res.status(400).json({ error: "Task is required and must be a string" });
        }
        if (!todoId || isNaN(todoId)) {
            console.log("Invalid todo_id in PUT request:", req.body.todo_id);
            return res.status(400).json({ error: "Todo ID is required and must be a number" });
        }
        console.log("Received PUT request with body:", req.body);
        db.prepare('UPDATE todos SET task = ? WHERE id = ?').run(task, todoId);
        console.log("Task updated successfully");
        res.status(204).json({});
    } catch (err) {
        console.error("Error updating task:", err.message);
        res.status(500).json({ error: "Failed to update task" });
    }
});

router.delete('/', function (req, res, next) {
    try {
        const todoId = req.body.todo_id;
        if (!todoId || isNaN(todoId)) {
            console.log("Invalid todo_id in DELETE request:", todoId);
            return res.status(400).json({ error: "Todo ID is required and must be a number" });
        }
        console.log("Received DELETE request with todo_id:", todoId);
        db.prepare('DELETE FROM todos WHERE id = ?').run(todoId);
        console.log("Task deleted successfully");
        res.status(204).json({});
    } catch (err) {
        console.error("Error deleting task:", err.message);
        res.status(500).json({ error: "Failed to delete task" });
    }
});

process.on('SIGINT', () => {
    console.log('Closing database connection...');
    db.close();
    console.log('Database connection closed');
    process.exit(0);
});

module.exports = router;