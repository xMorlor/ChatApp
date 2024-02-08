import { Link } from "react-router-dom";

const css = {
    wrapDiv: {
        margin: "16px",
        marginTop: "35px",
        fontSize: "12px",
    },
    span: {
        textDecoration: "underline",
        cursor: "pointer",
    },
};

function NotMemberLink() {
    return (
        <div style={css.wrapDiv}>
            Not a member? <Link to="/register">Sign up now</Link>
        </div>
    );
}

export default NotMemberLink;
