const express = require('express');

const router = express.Router();

const multer = require('multer');

const path = require('path');

const middleware = require('../middleware/studentmiddleware.js');

const {addcourse,courseUpdate,deleteCource,updatepassword,uploadsPhoto,uploads,allStudent,sendFriendRequest,acceptFriendRequest,rejectFriendRequest} = require('../controllers/studentController.js');


  
 router.use('/photo',express.static("photo"));

//addcourse only the student long 
router.post('/addcourse',middleware ,addcourse);

// courseUpdate
router.patch('/courseUpdate/:couresID',middleware,courseUpdate)

// deleteCource
router.delete('/deleteCource/:couresID',middleware,deleteCource)

 
// aploads the profile of student 
 



//update password of Student by student 
  
router.patch('/updatepassword/:studentID',middleware,updatepassword)




router.patch('/uploadsPhoto/studentPhotos',middleware,uploads.single('photo'), uploadsPhoto);
 
 
router.get('/allStudent',middleware,allStudent)

router.post('/sendFriendRequest',sendFriendRequest)

router.post('/acceptFriendRequest',acceptFriendRequest)

router.post('/rejectFriendRequest',rejectFriendRequest)

 module.exports = router 