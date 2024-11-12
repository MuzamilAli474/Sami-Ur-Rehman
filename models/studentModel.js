
const mongoose = require ("mongoose")


 const studentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    },
    name:{
        type:String,
        require: true
    },
email:{
    type : String ,
    require : true 

},
dob :{
   type : Date ,
   require : true 

},

batch: {
   type : String ,
   require : true
}



 });

 module.exports = mongoose.model("Student",studentSchema);