const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.jwttoken

exports.protect = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.jwttoken);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

exports.ifUserExist = (req,res,next)=>{
    const token = req.header('Authorization')?.split(' ')[1]
    if(token){
        jwt.verify(token , process.env.jwttoken , (err,decoded)=>{
            if(!err){
                return res.status(400).json({
                    success: false,
                    message: 'You are already logged in',
                });
            }
        })
    }
    next()
}

exports.authenticateToken=(req, res, next)=>{
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.jwttoken, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token.' });
        }
        req.user = user;
        req.token = token;
        next();
    });
}
const Blacklist = require('../model/Blacklist.model')
exports.checkBlacklist = async(req,res,next)=>{
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]
    if(token){
        const blacklisted = await Blacklist.findOne({ token })
        if(blacklisted){
            return res.status(401).json({message:' in blacklist'})
        }
    }
    next();
}