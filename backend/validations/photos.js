const validator = require('../helpers/validate');

const createPhoto = (req, res, next) => {
    const validationRule = {
        "title": "required|string",
        "url": "required|string",
        "album_id" : "required|integer"
    }
    validator(req.body.photo, validationRule, {}, (err, status) => {
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
const deletePhoto = (req,res,next) => {
    const validationRule = {
        "id" : "required|integer"
    }
    validator(req.params, validationRule, {}, (err, status) => {
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
const updatePhoto = (req,res,next) => {
    const validationRule = {
        "id" : "required|integer"
    }
    validator(req.params, validationRule, {}, (err, status) => {
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
  createPhoto,deletePhoto,updatePhoto
}