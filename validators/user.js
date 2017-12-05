const v = require('validators')
const User = require('../models/user')

module.exports.isValidateUserRegister = (user) => {
    const userModel = User.schema.obj

    for (prop in userModel) {
        if (userModel[prop].required && !user[prop])
            return false
    }

    return true
}
