const jwt =require("jsonwebtoken");

const tokenGenerator = (email) =>{
    const token = jwt.sign(
        {email},
        process.env.JWT_KEY,
        {expiresIn:"1hours"}
    )
    return token;
}
module.exports.tokenGenerator=tokenGenerator;