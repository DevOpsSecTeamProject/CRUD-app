var express = require('express');
var router = express.Router();
var sqlite = require("better-sqlite3");


/** create
 * @openapi
 * /:
 *   post:
 *     description: 'Task required in the body of the request e.g., {task: "Walk the cat"}'
 *     responses:
 *       201:
 *         description: Returns a blank object.
 */
router.post('/', function (req, res, next) {
  var db = new sqlite('database.db');
  db.prepare('INSERT INTO todos (task) VALUES (?)').run(req.body.task);
  res.status(201).json({})
});

/** read
 * @openapi
 * /:
 *   get:
 *     description: No inputs required
 *     responses:
 *       200:
 *         description: Returns an object of todos.
 */
router.get('/', function (req, res, next) {
  var db = new sqlite('database.db');
  var todos = db.prepare("SELECT * FROM todos").all();
  res.json({ todos: todos })
});


/** update
 * @openapi
 * /:
 *   put:
 *     description: "ID and task required in the body of the request e.g., {todo_id: 1, task: "Get food"}"
 *     responses:
 *       204:
 *         description: Returns a blank object.
 */
router.put('/', function (req, res, next) {
  var db = new sqlite('database.db');
  console.log(req.body)
  db.prepare('UPDATE todos SET task = ? where id = (?)').run(req.body.task, req.body.todo_id);
  res.status(204).json({})
});

/** delete
 * @openapi
 * /:
 *   delete:
 *     description: "ID data required in the body of the request e.g., {data: {todo_id: 1}}"
 *     responses:
 *       204:
 *         description: Returns a blank object.
 */
router.delete('/', function (req, res, next) {
  var db = new sqlite('database.db');
  db.prepare('DELETE FROM todos where id = (?)').run(req.body.todo_id);
  res.status(204).json({})
});

module.exports = router;
