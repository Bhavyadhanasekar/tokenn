const mongoose = require('mongoose')
const Schema = mongoose.Schema
var key ='123456789rsrtyurereer';
var encryptor = require('simple-encryptor')(key);

const isValidEmail = (email) => {

    const allowedDomains = ['gmail.com', 'example.com']; // Add your allowed domains
    const domain = email.split('@')[1];
    const EmailRegex =/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    return EmailRegex.test(email) && allowedDomains.includes(domain); //validate the email and check if the email conatin the allowed domains
};

const isValidPassword =(password)=>{
    var check = encryptor.decrypt(password)
    const isvalid = check.length>=6
    return isvalid
}

const teacherSchema = new Schema({

    Firstname:{
        type: String,
        required: true,
    },
    Lastname:{
        type: String,
        required: true,
    },
    Email:{
        type: String,
        required: [true,"Please enter Email"],
        unique: true, //check if the email Unique
        lowercase:true, //chnage the email into lowercase 
        validate:[isValidEmail,'please enter valid Email']
    },
    Password:{
        type: String,
        required: [true,"Please enter password"],
        validate:[isValidPassword,"minimum password length is 6 characters"]
    },
    Role:{
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Teachers',teacherSchema);