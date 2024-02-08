const checkSession = async (req, res) => {
    try {
        if (req.session.user) {
            res.send("true");
        } else {
            res.send("false");
        }
    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    checkSession,
};
