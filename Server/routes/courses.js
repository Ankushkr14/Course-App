const express = require('express');
const coursesRoute = express.Router();
//const {authMiddleware} = require('../middlewares/middleware')



coursesRoute.get('/preview', (req,res)=> {
    res.json({
        message: "courses preview"
    })
})

coursesRoute.post('/purchase', (req,res)=> {
    res.json({
        message: " course purchases"
    })
})

module.exports ={
    coursesRoute: coursesRoute
}


