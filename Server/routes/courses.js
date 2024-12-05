const express = require('express');
const coursesRoute = express.Router();
const {courseModel, coursesPurchasedModel} = require('../db');
const { userMiddleware } = require('../middlewares/auth.user');



coursesRoute.get('/preview', async (req,res)=> {
    
    const courses = await courseModel.find({});
    res.json({
        courses
    })
    
})

coursesRoute.post('/purchase',userMiddleware, async (req,res)=> {
    
    const userId = req.userId;
    const courseId = req.body.courseId;

    //need to check the user paid or not 
    try{
        // const purchaseStatus = await paymentService.verifyPayment(userId,courseId);
        // if(!purchaseStatus.success){
        //     return res.json({
        //         message: "payment failed, Try again"
        //     })
        // }


        const existingPurchasedCourse = await coursesPurchasedModel.findOne({userId,courseId});
        if(existingPurchasedCourse){
            return res.json({
                message: "Course is already purchased"
            })
        }
        await coursesPurchasedModel.create({
            userId,
            courseId
        });
        res.json({
            message:"You have successfully purchased the course"
        })
    }catch(err){
        res.json({
            message: err.message
        })
    }

})

module.exports ={
    coursesRoute: coursesRoute
}


