export const getLocation = () => {
    try {
        return fetch("https://countriesnow.space/api/v0.1/countries", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((result) => {
                return result.data;
            });
    } catch (e) {
        console.error(e);
    }
};
