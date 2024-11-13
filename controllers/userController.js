const User = require('../models/userModel.js');
const  Student = require('../models/studentModel.js');

const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
 const  {generateRandomPassword,sendEmail} = require('../middleware/mailer.js');
 
const secretKey ="12345";

const userRegister= async (req,res)=>{
    
    // console.log(req.body)
 try {
    const {name,email,password,age} = req.body;

const  user = await User.findOne({email});
// console.log(req.body)
if(user){
    return res.status(400).json({
        message:"User is already Register!"
    })
}
 


const newUser= await User.create({
    name,
    email,
    password,
    age,
    
   
})
// console.log(newUser)
 
return res.status(200).json({
    newUser,
    message:"User is Register sucessfully!"
})



 } catch (error) {
   res.status(500).json({
     message:"Internal server error!"
  })
 }



}


// login 

const login = async (req, res)=>{
 try {
    const {email,password} = req.body;
    // console.log(req.body)
  const userData = await User.findOne({ email , password })
//   console.log(userData)
 if(!userData){
    return res.status(400).json({
        message:"No data found!"
    })
 } 
if(userData.email==req.body.email && userData.password==req.body.password){

    const token = jwt.sign({email:userData.email,id:userData._id},secretKey);

    return res.status(200).json({
       
        userData,
        token,
        message:"User login Sucessfully!"
    })




}

 } catch (error) {

    return  res.status(5000).json({

        message:'Internal server error!'
    })
    
 }


};

 //register the student through login user 
const registerStudent = async (req, res) => {
    try {
        const { email, name, dob, batch } = req.body;

     
        

       
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({
                message: "Student is already registered with this email"
            });
        }
        const randomPassword = generateRandomPassword(10);
 
        const newStudent = await Student.create({
            userId: req.userId, 
            name,
            email,
            dob,
            batch,
            password:randomPassword
        });

        await sendEmail(email, randomPassword);
        return res.status(200).json({
            newStudent,
            message: "Student created successfully!"
        });

    } catch (error) {
      
        console.error('Error registering student:', error.message, error.stack);

       
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({
                message: "Validation error!",
                details: error.errors
            });
        }
 
        return res.status(500).json({
            message: "Internal server error!"
        });
    }
};


 
const studentsofLoginuser = async (req, res) => {
    try {
        const students = await Student.find({userId:req.userId})
       if(students.length===0){
        res.status(404).json({
            message: "Student not fount agenst this user"
        })
       }

       res.status(200).json({
       students,
         message : " student found!"
       })


    } catch (error) {
        return res.status(500).json({
            message: "Internal server error!"
        });
    }
  }


 
  const studentUpdate =  async (req , res )=>{
   
    try {
        
         const studentId = req.params.studentId;
        //  console.log(studentId)
        const newdataofStudent = req.body;
        // console.log(newdataofStudent)
        const userId = req.userId
        const student = await Student.findById(studentId);
        if(!student){
            res.status(404).json({
                message:"Student Not found! "
            })
            
        }
        // console.log(student.userId.toString())
         if(student.userId.toString() !== userId){
        
            res.status(403).json({

                message :" You are not authorized to update this student."
            })
         }else{

            const updateStudent = await Student.findByIdAndUpdate(studentId,newdataofStudent,{new: true})
           
             res.status(200).json({
                updateStudent,
                message:"Student Update successfully !"
             })
            }

    }
     catch (error) {
        return res.status(500).json({
            message: "Internal server error!"
        });
    }






  }
  
  
  const  delteStudent = async (req , res )=>{

    try {
        const studentId = req.params.studentId;
        const userId = req.userId
        // console.log(studentId);
        // console.log(userId)
         const student = await Student.findById(studentId)
         console.log(student);
         if(!student){
            res.status(404).json({
                message : "Student NOt found "
            })
         }
         if(student.userId.toString() !== userId){
            res.status(403).json({
                   message :" You are not authorized to update this student."
            })
         }else{
           const studentDelete = await Student.findByIdAndDelete(studentId)
            res.status(200).json({

                   message: "Student deleted successfully!"
            })

         }

    } catch (error) {
         message: "Internal server error!"
    }


  }



module.exports ={userRegister, login, registerStudent,studentsofLoginuser,studentUpdate,delteStudent}