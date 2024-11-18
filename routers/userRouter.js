const express = require('express');

const router = express.Router();

const {userRegister,login,registerStudent,studentsofLoginuser,studentUpdate,delteStudent,studentLogin} =require('../controllers/userController.js');

const middleware = require('../middleware/auth.js');
// const generateOTP= require('../middleware/mailer.js')

//all these api are related to teacher 
// user registration 
router.post('/userRegister',userRegister);

// user login 
router.post('/login',login);
// studentRegister
router.post('/studentRegister',middleware,registerStudent);
//student of login user for the list display
router.get('/studentsofLoginuser',middleware,studentsofLoginuser);



//all api related to the student 
router.post('/studentLogin',studentLogin)

router.patch('/studentUpdate/:studentId',middleware,studentUpdate);

// delete student 
router.delete('/deleteStudent/:studentId',middleware,delteStudent)

module.exports = router 