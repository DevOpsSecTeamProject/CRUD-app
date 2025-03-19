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
        if (e.target.value.length > 0) {
            setBtnAddDisabled(false);
        } else {
            setBtnAddDisabled(true);
        }
    }

    function handleUpdateText(e) {
        e.preventDefault();
        setUpdateText(e.target.value);
        if (e.target.value.length > 0) {
            setBtnEditDisabled(false);
        } else {
            setBtnEditDisabled(true);
        }
    }

    async function handleUpdate(e, id) {
        e.preventDefault();
        try {
            setUpdateText("");
            await axios.put("https://16.171.68.89", { todo_id: id, task: updateText });
            await getTodos();
        } catch (err) {
            setError("Failed to update todo: " + err.message);
        }
    }

    async function handleDelete(e, id) {
        e.preventDefault();
        try {
            await axios.delete("https://16.171.68.89", { data: { todo_id: id } });
            await getTodos();
        } catch (err) {
            setError("Failed to delete todo: " + err.message);
        }
    }

    function handleEdit(e, id) {
        e.preventDefault();
        var todos_arr = [...todos];
        var index = todos_arr.indexOf(todos_arr.find(function (todo) {
            return todo.id === id;
        }));
        todos_arr[index].isInEditingMode = true;
        setUpdateText(todos_arr[index].text);
    }

    //create
    async function handleSubmit(e) {
        e.preventDefault();
        console.log("Submitting new todo with text:", text);
        try {
            setText("");
            setBtnAddDisabled(true);
            const response = await axios.post("https://16.171.68.89", { task: text });
            console.log("POST response:", response.status, response.data);
            await getTodos();
        } catch (err) {
            setError("Failed to add todo: " + err.message);
        }
    }

    //read
    useEffect(() => {
        getTodos();
    }, []);

    const getTodos = async function () {
        try {
            console.log("Fetching todos...");
            var data = await axios.get("https://16.171.68.89");
            console.log("GET response:", data.data);
            var formattedData = data.data.todos.map(function (todo) {
                return {
                    text: todo.task,
                    id: todo.id,
                    isInEditingMode: false
                };
            });
            console.log("Formatted todos:", formattedData); 
            setTodos(formattedData);
            setError(""); 
        } catch (err) {
            setError("Failed to fetch todos: " + err.message);
        }
    };

    return (
        <div>
            {error && <div style={{ color: "red" }}>{error}</div>} {}
            <input value={text} onChange={handleInput} />
            <button onClick={handleSubmit} disabled={btnAddDisabled}>Add Todo</button>
            <ul>
                {todos.map(function (i, index) {
                    if (i.isInEditingMode) {
                        return (
                            <li key={index}>
                                <Todo todo={todos[index]} handleUpdateText={handleUpdateText} updateText={updateText} />
                                <button onClick={function (e) {
                                    handleUpdate(e, i.id);
                                }} disabled={btnEditDisabled}>Done updating</button>
                            </li>
                        );
                    } else {
                        return (
                            <li key={index}>
                                <Todo todo={todos[index]} handleUpdateText={handleUpdateText} updateText={updateText} />
                                <button onClick={function (e) {
                                    handleDelete(e, i.id);
                                }}>Delete</button>
                                <button onClick={function (e) {
                                    handleEdit(e, i.id);
                                }}>Update Todo</button>
                            </li>
                        );
                    }
                })}
            </ul>
        </div>
    );
}

export default TodosList;