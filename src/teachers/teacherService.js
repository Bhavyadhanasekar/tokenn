const teacherModel = require('./teacherModel');
const key = '123456789rsrtyurereer';
const encryptor = require('simple-encryptor')(key);

 
module.exports.createTeacherDBservice = async (teacherDetails)=>{

       try{
        const TeachersData = new teacherModel();
    
        TeachersData.Firstname = teacherDetails.Firstname;
        TeachersData.Lastname = teacherDetails.Lastname;
        TeachersData.Email = teacherDetails.Email;
        TeachersData.Password = teacherDetails.Password;
        const encrypted = encryptor.encrypt(teacherDetails.Password);
        TeachersData.Password=encrypted;
        TeachersData.Role = teacherDetails.Role;
        await TeachersData.save();
        return true;
        }

    catch(error)
    {
       console.log(Object.values(error.errors))
       return false;
    }
}
       // return TeachersData;

module.exports.FindTeacherbyEmail = async(email)=>{

    const response = teacherModel.findOne({Email:email}).exec()
    if(response && response.length>0)
    return response
    else
    return null;
}

module.exports.loginTeacherDBservice = async(details)=>{

    try{
        const result = await teacherModel.findOne({Email:details.Email});

        if(result!== undefined && result!==null)
        {
            var decryptor = encryptor.decrypt(result.Password)
            
            if(decryptor===details.Password)
            {
                console.log("Teachers Details are valid")
                return true;
            }
            else{
                console.log("Teachers Invalid details")
                return false
            }
        }
        else{
            console.log("Invalid details")
                return false
        }
    }
    catch(error){
    console.log(error)
    }
}

module.exports.DeleteteacherDBservice = async(TeacherData)=>{
    
    try{
    const deleteTeacher = await teacherModel.findOneAndDelete({Email:TeacherData.Email})

    if(deleteTeacher){
        console.log("Teacher Data deleted from the Database")
        return true;
    }
    else{
        console.log("Teacher Not found or maybe Already Deleted")
        return false;
    }
    }
    catch(err){
       console.log("Teacher Not found",err)
       return false;
    }
}

module.exports.GetAllTeachersService = async()=>{

    try{
        const AllTeacher = await teacherModel.find();
        return AllTeacher;
    }
    catch(err){
        console.log("There is no data found in Database",err)
        return false;
    }
}

