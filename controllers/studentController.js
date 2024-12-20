 const  Course = require('../models/studentcourseModel'); 

 const multer = require ('multer');
 const fs = require('fs');
 const path = require ('path');

 const Student = require('../models/studentModel');
  const Friendship = require('../models/friendshipModel.js')

 const  {sendEmail} = require('../middleware/mailer.js');
 

 const jwt = require('jsonwebtoken');

 const secretKey ="12345";
 

 const dir = './uploads/studentPhoto';
 if (!fs.existsSync(dir)) {
     fs.mkdirSync(dir);
 }
 
  
 const storage = multer.diskStorage({
     destination: (req, file, cb) => {
         cb(null, dir);  
     },
     filename: (req, file, cb) => {
         cb(null, file.originalname);
     }
   
 });
 
 const uploads = multer({ storage: storage });
 

 

const addcourse = async  ( req , res )=>{
try {
    const {courseName, courseCode, startDate, endDate } = req.body;

    // console.log(courseName, courseCode, startDate, endDate );
    
    const  StudentID =  req.studentID;
    // console.log(StudentID);
 if(!StudentID){
    
    return res.status(400).json({
        message:"student Not login !"
    })
 }
 const newCourse = await Course.create({
    courseName,
         courseCode, 
         startDate, 
         endDate,
         studentsID:StudentID
 })

 return res.status(200).json({
    newCourse,
    message: 'Course added successfully!',
 })


 
} catch (error) {
    return res.status(500).json({
        message: "Internal server error!"
    });
}
    




}



const courseUpdate = async ( req , res )=> {
 try {
    const couresID = req.params.couresID
    //  console.log(couresID)
    
     const newCoursedata = req.body ;
    
    //  console.log(newCoursedata);

    const StudentID = req.studentID;

    // console.log(StudentID);

    const  course = await Course.findById(couresID);
    //  console.log(course)
    if(!course){
        return  res.status(404).json({
            message:"Course  Not found! "
        })
    }
    if(course.studentsID.toString() !== StudentID){
      return  res.status(403).json({

            message :" You are not authorized to update this Course."
        })
    }else{
         const updateCourse = await Course.findByIdAndUpdate(couresID,newCoursedata,{new: true})
     
         return res.status(200).json({
            updateCourse,
            message:"Your course updated  successfully! "
         })

    }
 } catch (error) {
    return res.status(500).json({
        message: "Internal server error!"
    });
 }

}


const deleteCource= async ( req , res )=> {

  try {
    const couresID = req.params.couresID;
  console.log(couresID)
    const StudentID = req.studentID;
     console.log(StudentID)
    const  course = await Course.findById(couresID);
if(!course){
        return  res.status(404).json({
            message:"Course  Not found! "
        })
    }

    if(course.studentsID.toString() !== StudentID){
        return  res.status(403).json({
  
              message :" You are not authorized to Delete this Course."
          })
      }else{
   const deleteCource = await Course.findByIdAndDelete(couresID)

return res.status(200).json({
    deleteCource,
            message:"Your course Deleted successfully! "
         })

      }
  } catch (error) {
    return res.status(500).json({
        message: "Internal server error!"
    });
  }





}


const updatepassword= async (req, res )=>{
 try {

const studentId = req.params.studentID;
// console.log(studentId)
const {newpassword} = req.body;
const { oldpassword } = req.body;
// console.log(newpassword+ " oooooooooo" + oldpassword)
const StudentIDbymiddleware = req.studentID;
// console.log(StudentIDbymiddleware)

const  student = await Student.findById(studentId);
// console.log(student)
if(!student){
    return res.status(404).json({
        message:"Student Not Found ! that you want to aupdate Password"
    })
}
// console.log(student._id)
if(student._id.toString() !== StudentIDbymiddleware){
    return  res.status(403).json({

        message :" You are not authorized to Update  Password ."
    })
}
// console.log(req.body.newpassword)
 if(student.password !== req.body.oldpassword ){
    return  res.status(403).json({

        message :"  please check your oldPassword and try again ."
    })

 }else{

    const updatePass = await Student.findByIdAndUpdate(studentId,{password:newpassword,new:true})

    await sendEmail(student.email, newpassword);
    return  res.status(200).json({
       
        message :"your password is Updated successfully! "
    })


 }
    
 } catch (error) {
    return res.status(500).json({
        message: "Internal server error!"
    });
 }
 




}
 

const uploadsPhoto = async ( req , res )=>{
    
   try {
    const photo = req.file;
    // console.log(photo);
    if(!photo){
        return res.status(400).json({
            message:"File not founds that you want to upload!"
        })
    }
    const studentID =  req.studentID
    // console.log(studentID)
 const student = await Student.findById(studentID);
//  console.log(student)
if(!student){
    return res.status(404).json({
        message:"Student not found!"
    })
}
 
const filePath = `/uploads/studentphotos/${req.file.filename}`;
console.log(filePath)

const uploadphoto = await Student.findByIdAndUpdate(studentID,{photo:filePath,new:true})
return res.status(200).json({
    message:"Student profile photo uploaded successfully "
})


   } catch (error) {
    return res.status(500).json({
        message: "Internal server error!"
    });
   }

  
}

const allStudent = async (req, res) => {
    try {
     
      const students = await Student.find().select('name');
      
      if (students.length === 0) {
        return res.status(404).json({
          message: "No result found!"
        });
      } else {
        return res.status(200).json({
          students,
          message: "Students found!"
        });
      }
  
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error!"
      });
    }
  }
  
  
 const sendFriendRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;

    try {
        // Check if the friendship already exists
        const existingRequest = await Friendship.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent or friendship exists' });
        }

        // Create new friend request
        const newRequest = new Friendship({
            sender: senderId,
            receiver: receiverId,
            status: 'pending',
        });

        await newRequest.save();
        res.json({ message: 'Friend request sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const acceptFriendRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;

    try {
        // Find the friend request
        const request = await Friendship.findOne({ sender: senderId, receiver: receiverId });

        if (!request || request.status !== 'pending') {
            return res.status(400).json({ message: 'No pending friend request' });
        }

        // Update status to 'accepted'
        request.status = 'accepted';
        await request.save();

        res.json({ message: 'Friend request accepted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const rejectFriendRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;

    try {
        // Find the friend request
        const request = await Friendship.findOne({ sender: senderId, receiver: receiverId });

        if (!request || request.status !== 'pending') {
            return res.status(400).json({ message: 'No pending friend request' });
        }

        // Update status to 'rejected'
        request.status = 'rejected';
        await request.save();

        res.json({ message: 'Friend request rejected' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {addcourse,courseUpdate,deleteCource,updatepassword,uploadsPhoto,uploads,allStudent,sendFriendRequest,acceptFriendRequest,rejectFriendRequest}










