const validator = require('../helpers/validate');

const createAlbum = (req, res, next) => {
    const validationRule = {
        "title": "required|string",
        "user_id" : "required|integer"
    }
    validator(req.body.album, validationRule, {}, (err, status) => {
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
const deleteAlbum = (req,res,next) => {
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
const updateAlbum = (req,res,next) => {
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
  createAlbum,deleteAlbum,updateAlbum
}