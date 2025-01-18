const User = require('../model/auth.model');
const jwt = require('jsonwebtoken')
const Blacklist = require('../model/Blacklist.model')
const bcrypt = require('bcrypt');
const RefreshToken = require('../model/RefreshToken.model');
exports.registerUser = async (req, res) => {
    const { fullName, email, password, address , age } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already exists' });
        }
        const newUser = new User({fullName, email, password, address , age });
        await newUser.save();

        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: errors.join(', ') });
        }

        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.postloginuser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const isPasswordValid = await user.verifyPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.jwttoken,
            { expiresIn: '1h' }
        );
        RefreshToken.create({token})
        res.status(200).json({
            success: true,
            message:'success' ,
            token,
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.updateUserInfo = async(id,data)=>{
    try{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailregexDot  = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
     const Email = data.email.trim()
     if (!emailRegex.test(Email) ) {
        return Promise.reject('Invalid email address');
      }
      if(!emailregexDot.test(Email)){
        return Promise.reject('email must have ...');
      }
    if(data.password){
        if(password.length<8){
            return Promise.reject('password must be larger than 8 chars')
        }
        data.password = await bcrypt.hash(data.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
       return Promise.reject('can not updated information try later!')
        }else{
      return  Promise.resolve('information is updated succesfully!')
      }
    }catch(err){
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map((e) => e.message);
           return Promise.reject(errors.join(', ') )
        }
        return Promise.reject('Internal Server Error')
    }
}

exports.logout = async (req,res,next)=>{
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    const {refreshToken} = req.body
    if(token){
        await Blacklist.create({token})
        await RefreshToken.deleteOne({refreshToken})
    }
    
    res.status(200).json({success:true})
}