
const mongoose = require('mongoose');
var schema = mongoose.Schema;
var key ='123456789112345dfg';
var encryptor = require('simple-encryptor')(key);

const isValidEmail = (email) => {
    const allowedDomains = ['gmail.com', 'example.com']; // Add your allowed domains
    const domain = email.split('@')[1];
  
    const EmailRegex =/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    return EmailRegex.test(email) && allowedDomains.includes(domain); //validate the email and check if the email conatin the allowed domains
  };

const isValidPassword = (password)=>{
    var decrypted = encryptor.decrypt(password)
    const isvalid= decrypted.length>=6;
    return isvalid
}

const studentsSchema = new schema({
    Firstname:{
        type:String,
        required:true
    },

    Lastname:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:[true,"Please enter Email"],
        unique:true,//check if the email Unique
        lowercase:true,//chnage the email into lowercase 
        validate:[isValidEmail,"Please enter the valid Email"]
    },
    Password:{
        type:String,
        required:[true,"Please enter password"],
        validate:[isValidPassword,"minimum password length is 6 characters"] //call to the function isValidPassword
    }
});

module.exports = mongoose.model('Students', studentsSchema);