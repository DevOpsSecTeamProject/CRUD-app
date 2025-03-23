import { useState } from "react";

function Todo({ todo, handleUpdate, onTextChange }) {
    const [editText, setEditText] = useState(todo.text);

    const handleChange = (e) => {
        const newText = e.target.value;
        setEditText(newText);
        onTextChange(todo.id, newText);
        console.log("Text changed for id", todo.id, "to:", newText);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            console.log("Saving via Enter for id", todo.id, ":", editText);
            handleUpdate(e, todo.id, editText);
        }
    };

    return (
        <span>
            {todo.isInEditingMode ? (
                <input
                    value={editText}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="todo-edit-input"
                    autoFocus
                />
            ) : (
                todo.text
            )}
        </span>
    );
}

export default Todo;