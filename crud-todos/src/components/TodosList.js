import axios from "axios";
import { useState, useEffect } from "react";
import Todo from "./Todo";

function TodosList(params) {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState("");
    const [updateText, setUpdateText] = useState("");
    const [btnAddDisabled, setBtnAddDisabled] = useState(true);
    const [btnEditDisabled, setBtnEditDisabled] = useState(false);

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
        setUpdateText("");
        await axios.put("/api/todos", { todo_id: id, task: updateText });
        await getTodos();
    }

    async function handleDelete(e, id) {
        e.preventDefault();
        await axios.delete("/api/todos", { data: { todo_id: id } });
        await getTodos();
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
        setText("");
        setBtnAddDisabled(true);
        await axios.post("/api/todos", { task: text });
        await getTodos();
    }

    //read
    useEffect(() => {
        getTodos();
    }, []);

    const getTodos = async function () {
        var data = await axios.get("/api/todos");
        var formattedData = data.data.todos.map(function (todo) {
            return {
                text: todo.task,
                id: todo.id,
                isInEditingMode: false
            };
        });
        setTodos(formattedData);
    };

    return (
        <div>
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