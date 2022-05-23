const { Op } = require("sequelize");
const db = require("../models"); // models path depend on your structure
const User = db.user;
const getAllUsers = (req, res, next) => {
    let limit = 20;
    let offset = 0;
    if (typeof req.query.limit !== 'undefined') {
        limit = parseInt(req.query.limit) || 20;
    }

    if (typeof req.query.offset !== 'undefined') {
        offset = parseInt(req.query.offset) || 0;
    }
    // let query = {};
    // if(typeof req.query.search !== 'undefined'){
    // } 
    User.findAndCountAll({
        order: [
            ['id', "DESC"]
        ],
        offset: offset,
        limit: limit
    }).then(function (data) {
        res.send(data);
    }).catch(next);
};
const getOneUser = (req, res, next) => {
    User.findByPk(req.params.id).then(function (user) {
        if (!user) { return res.sendStatus(401); }
        return res.json(user);
    }).catch(next);
};

const updateUser  =   (req, res, next) => {
    User.findByPk(req.params.id).then(function (user) {
        if (!user) { return res.sendStatus(401); }
        // only update fields that were actually passed...
        if (typeof req.body.user.username !== 'undefined') {
            user.username = req.body.user.username;
        }
        if (typeof req.body.user.email !== 'undefined') {
            user.email = req.body.user.email;
        }
        if (typeof req.body.user.first_name !== 'undefined') {
            user.first_name = req.body.user.first_name;
        }
        if (typeof req.body.user.last_name !== 'undefined') {
            user.last_name = req.body.user.last_name;
        }
        if (typeof req.body.user.cnic !== 'undefined') {
            user.cnic = req.body.user.cnic;
        }
        if (typeof req.body.user.mobile !== 'undefined') {
            user.mobile = req.body.user.mobile;
        }
        if (typeof req.body.user.password !== 'undefined') {
            user.setPassword(req.body.user.password);
        }
        return user.save().then(function () {
            return res.json(user);
        });
    }).catch(next);
};
const createUser = (req, res, next) => {
    
    let user = new db.user;
    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.first_name = req.body.user.first_name;
    user.last_name = req.body.user.last_name;
    user.mobile = req.body.user.mobile;
    user.cnic = req.body.user.cnic;
    user.setPassword(req.body.user.password);
    user.save().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
            next();
        });
}
const deleteUser = (req,res,next) => {
    User.destroy({
        where: {
          id: req.params.id
        }
    }).then(function(){
        res.send({'message' : "User Deleted Successfully."})
    });
}
module.exports = { getAllUsers , getOneUser, updateUser , createUser ,deleteUser}