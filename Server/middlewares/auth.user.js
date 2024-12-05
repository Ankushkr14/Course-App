const jwt = require('jsonwebtoken')
const { JWT_USER_KEY} = require('../config')

const userMiddleware = (req, res, next) =>{

    const token = req.headers.token;

    if(!token){
        res.json({
            message: 'Unauthorised access'
        })
    }

    try{

        const decoded = jwt.verify(token, JWT_USER_KEY);
        req.userId = decoded.userId;
        next();

    }catch(err){
        console.log(err);
    }

}

module.exports = {
    userMiddleware
}