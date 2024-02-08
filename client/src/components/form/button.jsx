const css = {
    wrapDiv: {
        marginBottom: "16px",
        marginTop: "19px",
        padding: "5px",
    },
    button: {
        width: "fit-content",
        height: "fit-content",
        padding: "9px 23px 9px 23px",
        fontSize: "13px",
        cursor: "pointer",
    },
};

function Button({ onClickEvent, text }) {
    return (
        <div style={css.wrapDiv}>
            <button style={css.button} onClick={onClickEvent}>
                {text}
            </button>
        </div>
    );
}

export default Button;
