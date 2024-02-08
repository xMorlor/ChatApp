const userModels = require("../schemas/userSchema");

function validateRegisterUser(userData) {
    const { error, value } =
        userModels.userRegisterValidationSchema.validate(userData);
    return error ? error.details[0].message : null;
}

function validateGetUser(userData) {
    const { error, value } =
        userModels.userGetValidationSchema.validate(userData);
    return error ? error.details[0].message : null;
}

module.exports = {
    validateRegisterUser,
    validateGetUser,
};
