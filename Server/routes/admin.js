const express = require('express');
const adminRoute = express.Router();
const {adminModel, courseModel} = require('../db')
const { signupValidation, loginValidation } = require('./validationSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { adminMiddleware } = require('../middlewares/auth.admin');



adminRoute.post('/login',async (req,res)=>{
    const {email, password} = req.body;

    const result = loginValidation.safeParse({email,password})
    if(!result.success){
        return res.json({
            message: "Invalid email/password",
        })
    }
    try{

        const admin = await adminModel.findOne({email});
        if(!admin){
            return res.json({
                message: "Invalid Email"
            })
        }
        const isPasswordValid = await bcrypt.compare(password,admin.password);
        if(!isPasswordValid){
            return res.json({
                message: "Incorrect Password"
            })
        }
        const token = jwt.sign({
            id: admin._id,
        }, process.env.JWT_ADMIN_KEY,
        {expiresIn: '1h'}
        );

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000,
            sameSite: 'Strict'
        })        

        res.json({
            token: token,
            message: "Login Successfully"
        })


    }catch(err){
        res.json({
            message: err.message
        })
    }
    
})

adminRoute.post('/signup',async (req,res)=>{
    const {email, password, firstname, lastname} = req.body;

    const result = signupValidation.safeParse({
        email, 
        password,
        firstname,
        lastname
    });

    if(!result.success){
        return res.json({
            message: "Not registered successfully"
        })
    }
    

    try{
        const existingAdmin = await adminModel.findOne({email});
        if(existingAdmin){
            return res.status(411).json({
                message: "Email is already registered"
            })
        }

        const hashPassword = await bcrypt.hash(password,10);
        
        await adminModel.create({
            email,
            password: hashPassword,
            firstname,
            lastname
        });

        res.json({
            message:'Registered successfully'
        })

    }catch(err){
        res.json({
            message:err.message
        })
    }


})

adminRoute.post('/courses',adminMiddleware,async function(req,res){
    const adminId = req.adminId;

    try{

        const{title, description, price, imageUrl} = req.body;

        const course =await courseModel.create({
            title: title,
            description: description,
            price: price,
            imageUrl: imageUrl,
            creatorId: adminId,
        })

        res.json({
            message: "Course created successfully",
            courseId: course._id,
        })

    }catch(err){
        res.json({
            message:err.message
        })
    }
})

adminRoute.put('/courses',adminMiddleware, async (req,res)=>{
    const adminId = req.adminId;

    const {title,description,price,courseId, imageUrl} = req.body;

    const course =await courseModel.findOne({_id:courseId, creatorID: adminId});
    if(!course){
        return res.json({
            message:"CourseID is not correct"
        })
    }

    try{
        const updateCourse = await courseModel.updateOne({
            _id:courseId,
            creatorID: adminId
        },{
            title:title,
            description:description,
            price: price,
            imageUrl:imageUrl
        })
    
        res.json({
            message:"Course updated successfully",
            courseId: updateCourse._id
        });

    }catch(err){
        res.json({
            message: err.message
        })
    }

})

adminRoute.delete('/courses',adminMiddleware,async (req,res)=>{
    
    const adminId = req.adminId;
    const {courseId} = req.body;

    try{
        const course = await courseModel.findOne({_id:courseId, creatorId: adminId});
        if(!course){
            return res.json({message: "Course not found"});
        }
        
        await courseModel.deleteOne({_id:courseId});
        res.json({
            message: "Course deleted successfully"
        })
    }catch(err){
        res.json({message: err.message});
    }
})

adminRoute.get('/courses', adminMiddleware, async (req,res)=>{
    const adminId = req.adminId;

    const course = await courseModel.find({
        creatorId: adminId
    }).lean();
    res.json({
        message:"courses updated",
        course
    })
})

module.exports = {
    adminRoute: adminRoute
}

