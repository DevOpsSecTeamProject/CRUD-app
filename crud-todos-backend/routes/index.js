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

/** create
 * @openapi
 * /todos:
 *   post:
 *     description: 'Task required in the body of the request e.g., {task: "Walk the cat"}'
 *     responses:
 *       201:
 *         description: Returns a blank object.
 */
router.post('/todos', function (req, res, next) {
    try {
        console.log("Received POST request with task:", req.body.task);
        if (!req.body.task || typeof req.body.task !== 'string') {
            return res.status(400).json({ error: "Task is required and must be a string" });
        }
        db.prepare('INSERT INTO todos (task) VALUES (?)').run(req.body.task);
        console.log("Task inserted successfully");
        res.status(201).json({});
    } catch (err) {
        console.error("Error inserting task:", err.message);
        res.status(500).json({ error: "Failed to insert task" });
    }
});

/** read
 * @openapi
 * /todos:
 *   get:
 *     description: No inputs required
 *     responses:
 *       200:
 *         description: Returns an object of todos.
 */
router.get('/todos', function (req, res, next) {
    try {
        console.log("Fetching todos from database...");
        var todos = db.prepare("SELECT * FROM todos").all();
        console.log("Todos fetched:", todos);
        res.json({ todos: todos });
    } catch (err) {
        console.error("Error fetching todos:", err.message);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});

/** update
 * @openapi
 * /todos:
 *   put:
 *     description: "ID and task required in the body of the request e.g., {todo_id: 1, task: "Get food"}"
 *     responses:
 *       204:
 *         description: Returns a blank object.
 */
router.put('/todos', function (req, res, next) {
    try {
        console.log("Received PUT request with body:", req.body);
        if (!req.body.task || typeof req.body.task !== 'string') {
            return res.status(400).json({ error: "Task is required and must be a string" });
        }
        if (!req.body.todo_id || isNaN(req.body.todo_id)) {
            return res.status(400).json({ error: "Todo ID is required and must be a number" });
        }
        db.prepare('UPDATE todos SET task = ? WHERE id = ?').run(req.body.task, req.body.todo_id);
        console.log("Task updated successfully");
        res.status(204).json({});
    } catch (err) {
        console.error("Error updating task:", err.message);
        res.status(500).json({ error: "Failed to update task" });
    }
});

/** delete
 * @openapi
 * /todos:
 *   delete:
 *     description: "ID data required in the body of the request e.g., {data: {todo_id: 1}}"
 *     responses:
 *       204:
 *         description: Returns a blank object.
 */
router.delete('/todos', function (req, res, next) {
    try {
        const todoId = req.body.data ? req.body.data.todo_id : req.body.todo_id;
        if (!todoId || isNaN(todoId)) {
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

module.exports = router;