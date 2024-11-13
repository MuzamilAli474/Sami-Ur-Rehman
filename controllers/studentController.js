 const  Course = require('../models/studentcourseModel');


 const Student = require('../models/studentModel');



 const jwt = require('jsonwebtoken');

 const secretKey ="12345";



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

module.exports = {addcourse,courseUpdate,deleteCource}










