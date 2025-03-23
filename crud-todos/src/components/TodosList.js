import axios from "axios";
import { useState, useEffect } from "react";
import Todo from "./Todo";

function TodosList() {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState("");
    const [btnAddDisabled, setBtnAddDisabled] = useState(true);
    const [error, setError] = useState("");

    function handleInput(e) {
        e.preventDefault();
        setText(e.target.value);
        setBtnAddDisabled(e.target.value.length === 0);
    }

    async function handleUpdate(e, id, updatedText) {
        e.preventDefault();
        try {
            await axios.put("https://16.171.68.89/api", { todo_id: id, task: updatedText });
            await getTodos();
        } catch (err) {
            setError("Failed to update todo: " + err.message);
        }
    }

    async function handleDelete(e, id) {
        e.preventDefault();
        try {
            await axios.delete("https://16.171.68.89/api", { data: { todo_id: id } });
            await getTodos();
        } catch (err) {
            setError("Failed to delete todo: " + err.message);
        }
    }

    function handleEdit(e, id) {
        e.preventDefault();
        const todos_arr = [...todos];
        const index = todos_arr.findIndex(todo => todo.id === id);
        if (index !== -1) {
            todos_arr[index].isInEditingMode = true;
            setTodos([...todos_arr]);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("Submitting new todo with text:", text);
        try {
            setError("");
            setText("");
            setBtnAddDisabled(true);
            await axios.post("https://16.171.68.89/api", { task: text });
            await getTodos();
        } catch (err) {
            setError("Failed to add todo: " + err.message);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !btnAddDisabled) {
            handleSubmit(e);
        }
    };

    useEffect(() => {
        getTodos();
    }, []);

    const getTodos = async function () {
        try {
            console.log("Fetching todos...");
            const data = await axios.get("https://16.171.68.89/api");
            if (!data.data.todos || !Array.isArray(data.data.todos)) {
                setTodos([]);
                setError("");
                return;
            }
            const formattedData = data.data.todos.map(todo => ({
                text: todo.task,
                id: todo.todo_id, 
                isInEditingMode: false
            }));
            setTodos(formattedData);
            setError("");
        } catch (err) {
            setError("Failed to fetch todos: " + err.message);
        }
    };

    return (
        <div className="todos-container">
            <h1 className="todos-title">My To-Do List</h1>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <div className="input-section">
                <input
                    type="text"
                    value={text}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    className="todo-input"
                    placeholder="Add a new todo..."
                />
                <button onClick={handleSubmit} disabled={btnAddDisabled} className="add-button">
                    Add Todo
                </button>
            </div>
            <ul className="todos-list">
                {todos.map((todo) => (
                    <li key={todo.id} className="todo-item">
                        <div className="todo-content">
                            <Todo todo={todo} handleUpdate={handleUpdate} />
                        </div>
                        <div className="todo-actions">
                            {todo.isInEditingMode ? (
                                <button
                                    onClick={(e) => handleUpdate(e, todo.id, todo.text)} 
                                    className="done-button"
                                >
                                    Done
                                </button>
                            ) : (
                                <>
                                    <button onClick={(e) => handleDelete(e, todo.id)} className="delete-button">
                                        Delete
                                    </button>
                                    <button onClick={(e) => handleEdit(e, todo.id)} className="edit-button">
                                        Edit
                                    </button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodosList;