import { useState } from "react";

function Todo({ todo, handleUpdate, onTextChange }) {
    const [editText, setEditText] = useState(todo.text);

    const handleChange = (e) => {
        setEditText(e.target.value);
        onTextChange(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleUpdate(e, todo.id, editText);
        }
    };

    if (todo.isInEditingMode) {
        return (
            <span>
                <input
                    value={editText}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="todo-edit-input"
                    autoFocus
                />
            </span>
        );
    } else {
        return <span>{todo.text}</span>;
    }
}

export default Todo;