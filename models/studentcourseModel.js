
const mongoose = require ("mongoose")

 const studentcourceSchema = new  mongoose.Schema({
    courseName: {
         type: String, 
         required: true 
        },
    courseCode: { 
        type: String, 
        required: true
     },
     startDate: { 
        type: Date,
         required: true 
        },
     endDate: { 
        type: Date,
         required: true
         },

         studentsID: 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Student'  
            }
        

 })


module.exports = mongoose.model("Course", studentcourceSchema);
 
