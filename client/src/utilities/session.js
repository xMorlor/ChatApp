const routes = ["/home", "/profile", "/users", "/friends"];

const checkIfSessionExists = (currentRoute) => {
    try {
        return fetch("/checkSession", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.text())
            .then((result) => {
                if (
                    result === "true" &&
                    (currentRoute === "/login" || currentRoute === "/register")
                ) {
                    window.location.href = "/home"; //musí být přes window.location.href, protože LoginForm.js neni functional component, takže nelze používat use history ani navigate
                } else if (
                    result === "false" &&
                    routes.includes(currentRoute)
                ) {
                    window.location.href = "/login";
                }
            });
    } catch (e) {
        console.error(e);
    }
};

module.exports = {
    checkIfSessionExists,
};
