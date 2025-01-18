const mongoose = require('mongoose');
const bcrypt = require('bcrypt');  
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [3, 'Full name must be at least 3 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
    },
    age:{
        type:Number,
        required:true,
    },
    accountDate: {
        type: Date,
        default: Date.now,
    },
});
userSchema.methods.verifyPassword = async function(password){
    return bcrypt.compare(password,this.password)
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', userSchema);
