import axios from "axios";
import { useState, useEffect } from "react";
import Todo from "./Todo";

function TodosList(params) {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState("");
    const [updateText, setUpdateText] = useState("");
    const [btnAddDisabled, setBtnAddDisabled] = useState(true);
    const [btnEditDisabled, setBtnEditDisabled] = useState(false);
    const [error, setError] = useState("");

    function handleInput(e) {
        e.preventDefault();
        setText(e.target.value);
        setBtnAddDisabled(e.target.value.length === 0);
    }

    function handleUpdateText(e) {
        e.preventDefault();
        setUpdateText(e.target.value);
        setBtnEditDisabled(e.target.value.length === 0);
    }

    async function handleUpdate(e, id) {
        e.preventDefault();
        try {
            await axios.put("https://16.171.68.89/api", { todo_id: id, task: updateText });
            await getTodos();
            setUpdateText(""); // Move here after a successful update
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
        var todos_arr = [...todos];
        var index = todos_arr.findIndex(todo => todo.id === id);
        if (index !== -1) {
            todos_arr[index].isInEditingMode = true;
            setTodos([...todos_arr]); // Ensure UI updates
            setUpdateText(todos_arr[index].text);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("Submitting new todo with text:", text);
        try {
            setError(""); // Clear previous error
            setText("");
            setBtnAddDisabled(true);
            await axios.post("https://16.171.68.89/api", { task: text });
            await getTodos();
        } catch (err) {
            setError("Failed to add todo: " + err.message);
        }
    }

    useEffect(() => {
        getTodos();
    }, []);

    const getTodos = async function () {
        try {
            console.log("Fetching todos...");
            var data = await axios.get("https://16.171.68.89/api");
            if (!data.data.todos || !Array.isArray(data.data.todos)) {
                setTodos([]);
                setError("");
                return;
            }
            var formattedData = data.data.todos.map(todo => ({
                text: todo.task,
                id: todo.id,
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
            <h1 className="todos-title">My Todo List</h1>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <div className="input-section">
                <input
                    type="text"
                    value={text}
                    onChange={handleInput}
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
                        {todo.isInEditingMode ? (
                            <>
                                <Todo todo={todo} handleUpdateText={handleUpdateText} updateText={updateText} />
                                <button
                                    onClick={(e) => handleUpdate(e, todo.id)}
                                    disabled={btnEditDisabled}
                                    className="done-button"
                                >
                                    Done
                                </button>
                            </>
                        ) : (
                            <>
                                <Todo todo={todo} handleUpdateText={handleUpdateText} updateText={updateText} />
                                <button onClick={(e) => handleDelete(e, todo.id)} className="delete-button">
                                    Delete
                                </button>
                                <button onClick={(e) => handleEdit(e, todo.id)} className="edit-button">
                                    Edit
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodosList;
