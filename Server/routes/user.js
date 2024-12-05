const express = require('express');
const { signupValidation, loginValidation } = require('./validationSchema');
const { userModel } = require('../db');
const userRoute = express.Router();
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

userRoute.post('/signup',async (req, res) => {
    const {email, password, firstname, lastname} = req.body;

    const result = signupValidation.safeParse({email,password,firstname,lastname});
    if(!result.success){
        return res.json({
            message: "Incorrect email/password format"
        })
    }
    try{

        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.json({
                message: "Email is already registered"
            })
        }

        const hashPassword = await bcrypt.hash(password,10);

        await userModel.create({
            email,
            password: hashPassword,
            firstname,
            lastname
        });

        res.json({
            message: "User registered successfully"
        })

    }catch(err){
        res.json({
            message: err.message,
        })
    }
})

userRoute.post('/login',async (req,res)=> {
    const {email, password} = req.body;

    const result = loginValidation.safeParse({email, password});
    if(!result.success){
        return res.json({
            message: "Invalid email/password"
        })
    }

    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({
                message: "Email is not registered"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.json({
                message: "Incorrect password"
            })
        }
       
        const token = jwt.sign({
            id: user._id
        },process.env.JWT_USER_KEY,{expiresIn: '1h'});
        

        res.cookie('userToken',token,{
            httpOnly: true,
            secure: false,
            maxAge:3600000,
            sameSite:'strict'
        })
        res.json({
            message:"Login successfully",
            token: token
        })
    }catch(err){
        res.json({
            mesasge: err.message
        })
    }

})

userRoute.get('/purchases', (req,res)=>{
    res.json({
        message: "user purchase"
    })
})

module.exports= {
    userRoute : userRoute
}