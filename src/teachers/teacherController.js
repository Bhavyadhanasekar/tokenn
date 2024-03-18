const teacherService = require('./teacherService');
const teacherModel = require('../teachers/teacherModel')
const createTeacherController = async(req,res)=>{

    try{
        const ExistingTeacher = await teacherService.FindTeacherbyEmail(req.body.email)

        if(ExistingTeacher){
            res.send({"status":false, "message":"Teachers data is Already Existing in DB"})
            return;
        }
        const status = await teacherService.createTeacherDBservice(req.body);

        if(status){
            res.send({"status":true, "message":" User Created Successfully"})
        }else{
            res.send({"status":false, "message":"Error in Creating Teacher User [Check Your EMAIL or PASSWORD] and Enter details Properply"})
        }
     }
    catch(error)
    {
        console.log(error);
        res.status(500).send({"status": false, "message": "Teacher data you are trying to inserting is already Existing in DB"});
    }
}

const loginTeacherController = async(req,res)=>{
    
    var result=null;
    try{
        result = await teacherService.loginTeacherDBservice(req.body);
        if(result){

            const teacherdetail = await teacherModel.findOne({Email:req.body.Email});

            if(teacherdetail){
                res.send({
                    status:true,
                    message:"teacher Data Valid",
                    data:{
                        Firstname:teacherdetail.Firstname,
                        Lastname:teacherdetail.Lastname,
                        Email:teacherdetail.Email,
                        Role:teacherdetail.Role,
                    }
                });
            }else{
            res.send({"status":true, "message": "InValid Teachers Details"})
            }
        }else{
            res.send({"status":false, "message":"Invalid Teachers Details Check Password (or) Email properly"})
        }
    }
    catch(error){
        res.send({"status":false, "message":error.message})
    }
}

const deleteTeacherController = async(req,res)=>{

    try{
        const email = req.body;
        const status = await teacherService.DeleteteacherDBservice(email)
        if(status){
            res.send({"status":true, "message":"Teacher Data Deleted Successfully"})
        }else{
            res.send({"status":false, "message":"Teacher Data Not found"})
        }
    }
    catch(err){
        console.log(err);
        res.send({"status":false, "message": "Teacher Data Not found or maybe Already deleted"})
    }
}

const showAllTeacherController = async (req, res) => {
    try {
        const AllTeachers = await teacherService.GetAllTeachersService(); 

        if (AllTeachers.length > 0) {
            res.send({ "status": true, "teachers": AllTeachers });
        } else {
            res.send({ "status": false, "message": "No teachers found." });
        }
    } catch (error) {
        console.error("Error in showAllTeacherController:", error);
        res.status(500).send({ "status": false, "message": "Internal Server Error" });
    }
};


module.exports={createTeacherController,loginTeacherController,deleteTeacherController,showAllTeacherController};

