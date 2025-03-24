import axios from "axios";
import { useState, useEffect } from "react";
import Todo from "./Todo";

function TodosList() {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState("");
    const [btnAddDisabled, setBtnAddDisabled] = useState(true);
    const [error, setError] = useState("");
    const [editedTexts, setEditedTexts] = useState({});

    function handleInput(e) {
        e.preventDefault();
        setText(e.target.value);
        setBtnAddDisabled(e.target.value.length === 0);
    }

    async function handleUpdate(e, id, updatedText) {
        e.preventDefault();
        try {
            console.log("Updating todo:", { id, updatedText });
            await axios.put("https://13.61.122.171/api", { todo_id: id, task: updatedText });
            const todos_arr = [...todos];
            const index = todos_arr.findIndex(todo => todo.id === id);
            if (index !== -1) {
                todos_arr[index].isInEditingMode = false;
                setTodos([...todos_arr]);
            }
            await getTodos();
            setEditedTexts(prev => {
                const newEdited = { ...prev };
                delete newEdited[id];
                return newEdited;
            });
        } catch (err) {
            setError("Failed to update todo: " + err.message);
            console.error("Update error:", err);
        }
    }

    async function handleDelete(e, id) {
        e.preventDefault();
        try {
            console.log("Deleting todo with id:", id);
            const response = await axios.delete("https://13.61.122.171/api", { data: { todo_id: id } });
            console.log("Delete response:", response.data);
            await getTodos();
        } catch (err) {
            setError("Failed to delete todo: " + err.message);
            console.error("Delete error:", err);
        }
    }

    function handleEdit(e, id) {
        e.preventDefault();
        const todos_arr = [...todos];
        const index = todos_arr.findIndex(todo => todo.id === id);
        if (index !== -1) {
            console.log("Editing todo with id:", id);
            todos_arr[index].isInEditingMode = true;
            setTodos([...todos_arr]);
            setEditedTexts(prev => ({ ...prev, [id]: todos_arr[index].text }));
            console.log("Updated todos after edit:", todos_arr);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("Submitting new todo with text:", text);
        try {
            setError("");
            setText("");
            setBtnAddDisabled(true);
            await axios.post("https://13.61.122.171/api", { task: text });
            await getTodos();
        } catch (err) {
            setError("Failed to add todo: " + err.message);
            console.error("Submit error:", err);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !btnAddDisabled) {
            handleSubmit(e);
        }
    };

    const handleTextChange = (id, newText) => {
        setEditedTexts(prev => ({ ...prev, [id]: newText }));
        console.log("Edited texts updated:", { ...editedTexts, [id]: newText });
    };

    useEffect(() => {
        getTodos();
    }, []);

    const getTodos = async function () {
        try {
            console.log("Fetching todos...");
            const data = await axios.get("https://13.61.122.171/api");
            console.log("Raw API response:", data.data);
            if (!data.data.todos || !Array.isArray(data.data.todos)) {
                setTodos([]);
                setError("No todos found or invalid data");
                return;
            }
            const formattedData = data.data.todos.map(todo => ({
                text: todo.task,
                id: todo.id, 
                isInEditingMode: false
            }));
            setTodos(formattedData);
            setError("");
            console.log("Formatted todos:", formattedData);
        } catch (err) {
            setError("Failed to fetch todos: " + err.message);
            console.error("Fetch error:", err);
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
                            <Todo
                                todo={todo}
                                handleUpdate={handleUpdate}
                                onTextChange={handleTextChange}
                            />
                        </div>
                        <div className="todo-actions">
                            {todo.isInEditingMode ? (
                                <button
                                    onClick={(e) => handleUpdate(e, todo.id, editedTexts[todo.id] || todo.text)}
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