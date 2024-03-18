var studentsmodel = require('./studentModel');
var key = '123456789112345dfg';
var encryptor = require('simple-encryptor')(key);
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'qO68z&f#2p@S3N!Lm$5gH'; 

const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};



module.exports.createUserDBService = async (studentsDetails) => {
    try {
        var studentsModelData = new studentsmodel();

        studentsModelData.Firstname = studentsDetails.Firstname;
        studentsModelData.Lastname = studentsDetails.Lastname;
        studentsModelData.Email = studentsDetails.Email;
        studentsModelData.Password = studentsDetails.Password;
        var encrypted = encryptor.encrypt(studentsDetails.Password);
        studentsModelData.Password = encrypted;

        await studentsModelData.save();

        // Generate JWT token
        const token = jwt.sign({ email: studentsModelData.Email }, JWT_SECRET, { expiresIn: '15m' });

        return { success: true, student: studentsModelData, token }; // Return success, student, and token
    } catch (error) {
        console.error(error);
        return { success: false }; // Return failure if an error occurs
    }
};



module.exports.FindStudentbyEmail = async (email) => {
    const response = await studentsmodel.findOne({ Email: email }).exec()
    if (response && response.length > 0)
        return response;
    else
        return null;
}

module.exports.loginStudentsDBservice = async (studentsDetails) => {
    try {
        const result = await studentsmodel.findOne({ Email: studentsDetails.Email })
        if (result !== undefined && result !== null) {
            var decrypted = encryptor.decrypt(result.Password);
            if (decrypted === studentsDetails.Password) {
                console.log("student validated successfully");
                const token = generateToken({ email: studentsDetails.Email }); // Generate token
                return { success: true, token };
            } else {
                console.log("student validated failed");
                return { success: false };
            }
        } else {
            console.log("invalid students details");
            return { success: false };
        }
    } catch (err) {
        console.log(err)
        return { success: false };
    }
}

module.exports.deleteStudentData = async (email) => { // Accept email as parameter
    try {
        console.log("Attempting to delete student data for email:", email);
        const deletedStudent = await studentsmodel.findOneAndDelete({ Email: email }); // Use email to find and delete student data
        console.log("Deleted student:", deletedStudent);
        if (deletedStudent) {
            console.log("Student data deleted Successfully");
            return true;
        } else {
            console.log("Student data not found (or) Maybe already deleted");
            return false;
        }
    }
    catch (error) {
        console.error("Error deleting student data:", error);
        return false;
    }
}




module.exports.showAllStudentsData = async () => {
    try {
        const Allstudents = await studentsmodel.find();
        return Allstudents;
    } catch (error) {
        console.log("There is No data in DataBase", error)
        return false;
    }
}