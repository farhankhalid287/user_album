const validator = require('../helpers/validate');

const createUser = (req, res, next) => {
    const validationRule = {
        "email": "required|email|exist:user,email",
        "username": "required|string|exist:user,username",
        "mobile": "required|string",
        "first_name" : "required|string",
        "last_name" : "required|string",
        "password": "required|string|min:6",
        "cnic": "required|string|valid_cnic"
    }
    validator(req.body.user, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    });
}

module.exports = { 
  createUser
}