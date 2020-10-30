const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require('../models/User');

module.exports.login = async function(req, res) {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const user = await User.findOne({email: userEmail});

    if (user) {
        // Check user password
        const passwordResult = bcrypt.compareSync(userPassword, user.password);
        if (passwordResult) {
            // Create a new token
            const token = jwt.sign({
                email: user.email,
                userId: user._id
            }, keys.jwt, {expiresIn: 60 * 60});

            res.status(200).json({
                token: `Bearer ${token}`
            });
        }
        else {
            // Password is not matched - throw an error
            res.status(401).json({
                message: "User with such combination of email and password is not found"
            });
        }
    }
    else {
        // User has not been found - throw an error
        res.status(401).json({
            message: "User with such combination of email and password is not found"
        })
    }
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