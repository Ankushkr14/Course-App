const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const adminMiddleware = (req,res, next)=>{
    
    const token = req.cookies.token;

    if(!token){
        return res.json({
            message: "Unauthorised access"
        })
    }
    try{

        const decoded = jwt.verify(token, process.env.JWT_ADMIN_KEY);
        req.adminId = decoded.id;
        next();

    }catch(err){
        console.log(err);
    }
}

module.exports = {
    adminMiddleware
}