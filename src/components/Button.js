

function Button({ onClick, children, color = "primary" }) {
    return (
        <button onClick={onClick} className={`btn btn-${color}`}>
            {children}
        </button>
    );
}

export default Button;