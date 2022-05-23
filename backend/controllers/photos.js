const { Op } = require("sequelize");
const db = require("../models"); // models path depend on your structure
const Photos = db.photos;
const getAllPhotos = (req, res, next) => {
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
    Photos.findAndCountAll({
        order: [
            ['id', "DESC"]
        ],
        offset: offset,
        limit: limit
    }).then(function (data) {
        res.send(data);
    }).catch(next);
};
const getSignlePhoto = (req, res, next) => {
    Photos.findByPk(req.params.id).then(function (photo) {
        if (!photo) { return res.sendStatus(401); }
        return res.json(photo);
    }).catch(next);
};

const updatePhoto  =   (req, res, next) => {
    Photos.findByPk(req.params.id).then(function (photo) {
        if (!photo) { return res.sendStatus(401); }
        // only update fields that were actually passed...
        if (typeof req.body.photo.title !== 'undefined') {
            photo.title = req.body.photo.title;
        }
        if (typeof req.body.photo.url !== 'undefined') {
            photo.url = req.body.photo.url;
        } 
        if(typeof req.body.photo.album_id !== 'undefined') {
            photo.album_id = req.body.photo.album_id;
        }
        return photo.save().then(function () {
            return res.json(photo);
        });
    }).catch(next);
};
const createPhoto = (req, res, next) => {
    
    let photo = new db.photos;
    photo.title = req.body.photo.title;
    photo.album_id = req.body.photo.album_id;
    photo.url = req.body.photo.url;
    photo.save().then(data => {
        res.send(data);
    })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: err.message || "Some error occurred while creating the album."
            });
            next();
        });
}
const deletePhoto = (req,res,next) => {
    Photos.destroy({
        where: {
          id: req.params.id
        }
    }).then(function(){
        res.send({'message' : "Photo Deleted Successfully."})
    });
}
const getAlbumPhotos = (req,res,next) => {
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
    Photos.findAndCountAll({
        where : {
            album_id : req.params.id
        },
        order: [
            ['id', "DESC"]
        ],
        offset: offset,
        limit: limit
    }).then(function (data) {
        res.send(data);
    }).catch(next);
}
module.exports = { getAllPhotos , getSignlePhoto, updatePhoto , createPhoto ,deletePhoto,getAlbumPhotos}