const express = require('express');

const router = express.Router();

const {userRegister,login,registerStudent,studentsofLoginuser,studentUpdate,delteStudent,studentLogin} =require('../controllers/userController.js');

const middleware = require('../middleware/auth.js');
// const generateOTP= require('../middleware/mailer.js')
// user registration 
router.post('/userRegister',userRegister);

// user login 
router.post('/login',login);


router.post('/studentRegister',middleware,registerStudent);
router.post('/studentLogin',studentLogin)
router.get('/studentsofLoginuser',middleware,studentsofLoginuser);

router.patch('/studentUpdate/:studentId',middleware,studentUpdate);

// delete student 
router.delete('/deleteStudent/:studentId',middleware,delteStudent)

module.exports = router 