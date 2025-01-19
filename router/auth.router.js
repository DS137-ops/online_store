const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const verifyToken = require('../middlewares/auth.middleware')
const router = express.Router();

router.post(
    '/register',
    [
        body('fullName').trim().isLength({ min: 3 }).withMessage('Full name must be at least 3 characters long'),
        body('email').trim().isEmail().withMessage('Please provide a valid email address'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
        body('address').trim().notEmpty().withMessage('Address is required'),
        body('age').notEmpty().withMessage('Age is required'),
    ],
    authController.registerUser
);
router.post('/login',verifyToken.ifUserExist,
    [
        body('email').trim().isEmail().withMessage('Please provide a valid email address'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    authController.postloginuser
)
router.put('/updateInfo/:id',[
    body('fullName').trim().isLength({ min: 3 }).withMessage('Full name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
],(req,res)=>{
     const userID = req.params.id
     const updatedData= {fullName , email , password , address} = req.body
     authController.updateUserInfo(userID , updatedData).then((data)=>{
        return res.status(200).json({success:true , msg:data})
     }).catch((err)=>{
        return res.status(400).json({success:false , msg:err})
     })
})

router.post('/logout' , verifyToken.checkBlacklist , authController.logout)
router.get('/getUserInfo/:id' , authController.getUserInfo)
module.exports = router;