const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports.login = function(req, res) {
    res.status(200).json({
        login: {
            email: req.body.email,
            password: req.body.password
        }
    })
}

module.exports.register = async function(req, res) {
    let userEmail = req.body.email;
    let userPassword = req.body.password;
    let user = await User.findOne({email: userEmail})

    if (user) {
        // User have been found - throw an error
        res.status(409).json({
            message: 'Email exists'
        })
    }
    else {
        const salt = bcrypt.genSaltSync(10);
        user = new User({
            email: userEmail,
            password: bcrypt.hashSync(userPassword, salt)
        })

        try {
            await user.save();
            res.status(201).json(user);
        }
        catch(e) {
            // TODO - add error handling
        }
    }
}