const login = (username, password) => {
    try {
        return fetch("/login", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                user: {
                    username: username,
                    password: password,
                },
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.text())
            .then((result) => {
                return result;
            });
    } catch (e) {
        console.error(e);
    }
};

const signUp = (username, password, confirmPassword) => {
    const usernameRegExp = new RegExp("^[A-Za-z0-9]{1,16}$");
    const passwordRegExp = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,16}$"
    );

    if (usernameRegExp.test(username) === false) {
        return "Invalid username. Only characters and numbers are allowed. 1 - 16 length";
    }

    if (password !== confirmPassword) {
        return "Passwords does not match.";
    }

    if (passwordRegExp.test(password) === false) {
        return "Invalid password.";
    }

    try {
        return fetch("/register", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                user: {
                    username: username,
                    password: password,
                },
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.text())
            .then((result) => {
                return result;
            });
    } catch (e) {
        console.error(e);
    }
};

const logOut = () => {
    try {
        fetch("/logOut", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.text())
            .then((result) => {
                console.log(result);
            });
    } catch (e) {
        console.error(e);
    }
};

module.exports = {
    signUp,
    login,
    logOut,
};
