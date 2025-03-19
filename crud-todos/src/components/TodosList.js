import axios from "axios";
import { useState, useEffect } from "react";
import Todo from "./Todo";

function TodosList() {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState("");
    const [updateText, setUpdateText] = useState("");
    const [btnAddDisabled, setBtnAddDisabled] = useState(true);
    const [btnEditDisabled, setBtnEditDisabled] = useState(false);

    // Handle input for adding new todo
    const handleInput = (e) => {
        e.preventDefault();
        setText(e.target.value);
        setBtnAddDisabled(e.target.value.length === 0);
    };

    // Handle input for updating todo
    const handleUpdateText = (e) => {
        e.preventDefault();
        setUpdateText(e.target.value);
        setBtnEditDisabled(e.target.value.length === 0);
    };

    // Update todo
    const handleUpdate = async (e, id) => {
        e.preventDefault();
        setUpdateText("");
        await axios.put("http://localhost:8080/", { todo_id: id, task: updateText });
        await getTodos();
    };

    // Delete todo
    const handleDelete = async (e, id) => {
        e.preventDefault();
        await axios.delete("http://localhost:8080/", { data: { todo_id: id } });
        await getTodos();
    };

    // Enable edit mode
    const handleEdit = (e, id) => {
        e.preventDefault();
        const todosArr = [...todos];
        const index = todosArr.findIndex((todo) => todo.id === id);
        todosArr[index].isInEditingMode = true;
        setUpdateText(todosArr[index].text);
    };

    // Add new todo
    const handleSubmit = async (e) => {
        e.preventDefault();
        setText("");
        setBtnAddDisabled(true);
        await axios.post("http://localhost:8080/", { task: text });
        await getTodos();
    };

    // Fetch todos on mount
    useEffect(() => {
        getTodos();
    }, []);

    // Fetch todos from API
    const getTodos = async () => {
        const { data } = await axios.get("https://github.com/DevOpsGroupCA/DevOpsApplication/blob/main/crud-todos-backend/app.js:8080");
        const formattedData = data.todos.map((todo) => ({
            text: todo.task,
            id: todo.id,
            isInEditingMode: false,
        }));
        setTodos(formattedData);
    };

    return (
        <div className="todos-container">
            <h1 className="todos-title">My Todo List</h1>
            <div className="input-section">
                <input
                    type="text"
                    value={text}
                    onChange={handleInput}
                    className="todo-input"
                    placeholder="Add a new todo..."
                />
                <button
                    onClick={handleSubmit}
                    disabled={btnAddDisabled}
                    className="add-button"
                >
                    Add Todo
                </button>
            </div>
            <ul className="todos-list">
                {todos.map((todo, index) => (
                    <li key={index} className="todo-item">
                        {todo.isInEditingMode ? (
                            <>
                                <Todo
                                    todo={todo}
                                    handleUpdateText={handleUpdateText}
                                    updateText={updateText}
                                />
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
                                <Todo
                                    todo={todo}
                                    handleUpdateText={handleUpdateText}
                                    updateText={updateText}
                                />
                                <button
                                    onClick={(e) => handleDelete(e, todo.id)}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={(e) => handleEdit(e, todo.id)}
                                    className="edit-button"
                                >
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
