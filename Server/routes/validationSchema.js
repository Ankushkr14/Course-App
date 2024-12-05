const {z } = require('zod');

const signupValidation = z.object({
    email: z.string().email({
        message: 'Invalid email address'
    }),
    password: z.string().min(8, {
        message: " Password must be at least 8 characters long"
    }),
    firstname: z.string().min(1,{
        message:'first name is required'
    }),
    lastname: z.string().min(1,{
        message: "last name is required"
    })
});

const loginValidation = z.object({
    email: z.string().email({
        message: "Invalid email address"
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long"
    })
})

module.exports = {
    signupValidation,
    loginValidation
};