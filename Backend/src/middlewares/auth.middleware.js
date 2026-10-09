const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');


module.exports.authUser = async (req, res, next) => {

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("USER TOKEN ID:", decoded._id);

        const user = await userModel.findById(decoded._id);

        console.log("USER:", user);

        req.user = user;

        return next();

    } catch (err) {

        console.log("AUTH USER ERROR:", err);

        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];


    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlacklisted = await blackListTokenModel.findOne({ token: token });



    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

 try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("TOKEN ID:", decoded._id);

    const captain = await captainModel.findById(decoded._id);

    console.log("CAPTAIN:", captain);

    const allCaptains = await captainModel.find({});
    console.log("ALL CAPTAINS:", allCaptains);

    req.captain = captain;

    return next();

} catch (err) {
    console.log(err);
    return res.status(401).json({ message: 'Unauthorized' });
}
}
