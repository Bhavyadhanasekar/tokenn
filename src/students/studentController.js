var studentsService = require('./studentService');
const studentModel = require('../students/studentModel');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'qO68z&f#2p@S3N!Lm$5gH';
 

var createstudentsController = async (req, res) => {
    try {
        const ExistingStudent = await studentsService.FindStudentbyEmail(req.body.email);

        if (ExistingStudent) {
            return res.status(400).json({ "status": false, "message": "Student with this email already exists" });
        }

        const { success, student } = await studentsService.createUserDBService(req.body);

        if (success && student) {
            // Generate JWT token
            const token = jwt.sign({ email: student.email }, JWT_SECRET, { expiresIn: '15m' }); // Use JWT_SECRET here

            return res.status(201).json({ status: true, message: "Student created successfully", token });
        } else {
            return res.status(500).json({ status: false, message: "Error creating student or generating token" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ "status": false, "message": "Internal server error" });
    }
};

var loginstudentsController = async (req, res) => {
    var result = null;
    try {
        result = await studentsService.loginStudentsDBservice(req.body);

        if (result) {
            const studentsdetail = await studentModel.findOne({ Email: req.body.Email });
            if (studentsdetail) {
                res.send({
                    status: true,
                    message: "Student details is valid",
                    data: {
                        Firstname: studentsdetail.Firstname,
                        Lastname: studentsdetail.Lastname,
                        Email: studentsdetail.Email,
                    }
                });
            } else {
                res.send({ "status": false, "message": "students details  Invalid" });
            }
        } else {
            res.send({ "status": false, "message": "Invalid Teachers Details Check Password (or) Email properly" });
        }
        const { success, token } = await studentsService.loginStudentsDBservice(req.body);
        if (success) {
            res.send({ status: true, message: "Student logged in successfully", token });
        } else {
            res.send({ status: false, message: "Invalid Teachers Details. Check Password (or) Email properly" });
        }

    } catch (error) {
        res.send({ "status": false, "message": "students details invalid" });
    }
}

var DeletestudentController = async (req, res) => {
    try {
        const { email } = req.body; // Extract email from request body
        if (!email) {
            return res.status(400).json({ "status": false, "message": "Email is required" });
        }
        const status = await studentsService.deleteStudentData(email); // Pass email to deleteStudentData function
        if (status) {
            return res.status(200).json({ "status": true, "message": "Student details deleted successfully" });
        } else {
            return res.status(404).json({ "status": false, "message": "Student data not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "status": false, "message": "Internal server error" });
    }
};

var showAllStudentsController = async (req, res) => {
    try {
        const Allstudents = await studentsService.showAllStudentsData();

        if (Allstudents.length > 0) {
            res.send({ "status": true, "message": Allstudents });
            return true;
        } else {
            res.send({ "status": false, "message": "There is no data in DB" })
            return false;
        }
    } catch (error) {
        res.send({ "status": false, "message": "There is no data in Database", error })
        return false;
    }
}

module.exports = { createstudentsController, loginstudentsController, DeletestudentController, showAllStudentsController };
