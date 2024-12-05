
const {mongoose} = require('mongoose');
const { Schema,Types }  = require('mongoose');



const userSchema = Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    }
});

const adminSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    }
});

const courseSchema = Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
        min: 0,
    },
    imageUrl: {
        type: String,
    },
    creatorId:{
        type: Types.ObjectId,
        ref:'Admin'
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
});

const purchaseSchema = Schema({
    courseId:{
        type : Types.ObjectId,
        required: true,
        ref: 'Course',
    },
    purchasedAT: {
        type: Date,
        default: Date.now,
    },
    userID: {
        type: Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

const userModel = mongoose.model('User', userSchema);
const adminModel = mongoose.model('Admin', adminSchema);
const courseModel = mongoose.model('Course', courseSchema);
const coursesPurchasedModel = mongoose.model('CoursePurchased', purchaseSchema);

module.exports={
    userModel,
    adminModel,
    courseModel,
    coursesPurchasedModel
}
