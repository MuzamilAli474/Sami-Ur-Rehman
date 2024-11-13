const express = require('express');

const router = express.Router();

const middleware = require('../middleware/studentmiddleware.js')
const {addcourse,courseUpdate,deleteCource} = require('../controllers/studentController.js')

router.post('/addcourse',middleware ,addcourse);


router.patch('/courseUpdate/:couresID',middleware,courseUpdate)


router.delete('/deleteCource/:couresID',middleware,deleteCource)








 module.exports = router 