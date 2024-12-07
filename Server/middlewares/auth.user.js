const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');

const userMiddleware = (req, res, next) =>{

    const token = req.cookies.token;

    if(!token){
        res.json,status(404)({
            message: 'Unauthorised access'
        })
    }

    try{

        const decoded = jwt.verify(token,process.env.USER_KEY);
        req.userId = decoded.id;
        next();

    }catch(err){
        console.log(err);
    }

}

module.exports = {
    userMiddleware
}