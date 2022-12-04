const jwt = require('jsonwebtoken');
const Admin = require('../model/admin');

module.exports = async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const email = decodedToken.email;

        console.log(email);
        //check if email is not null
        if(email){
            const admin= await Admin.findOne({email:email},{status:1,_id:0});

            //check if the admin is valid
            //if not then notify the user
            if(!admin){
                return res.send(401).json({message:'Invalid authorization token.'});
            }

            //else let the request go ahead
            return next();            
        }

        if (req.body.email && req.body.email !== email) {
            throw 'Invalid authorization token.';
        } else {
            next();
        }
    } catch (err) {
        res.status(401).json({
            message: new Error('Invalid authorization token.').message
        });
    }
}