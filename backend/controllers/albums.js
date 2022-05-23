const { Op } = require("sequelize");
const db = require("../models"); // models path depend on your structure
const Albums = db.albums;
const getAllAlbums = (req, res, next) => {
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
    Albums.findAndCountAll({
        order: [
            ['id', "DESC"]
        ],
        offset: offset,
        limit: limit
    }).then(function (data) {
        res.send(data);
    }).catch(next);
};
const getSignleAlbum = (req, res, next) => {
    Albums.findByPk(req.params.id).then(function (album) {
        if (!album) { return res.sendStatus(401); }
        return res.json(album);
    }).catch(next);
};

const updateAlbum  =   (req, res, next) => {
    Albums.findByPk(req.params.id).then(function (album) {
        if (!album) { return res.sendStatus(401); }
        // only update fields that were actually passed...
        if (typeof req.body.album.title !== 'undefined') {
            album.title = req.body.album.title;
        }
        if (typeof req.body.album.user_id !== 'undefined') {
            album.user_id = req.body.album.user_id;
        }
        return album.save().then(function () {
            return res.json(album);
        });
    }).catch(next);
};
const createAlbum = (req, res, next) => {
    
    let album = new db.albums;
    album.title = req.body.album.title;
    album.user_id = req.body.album.user_id;
    album.save().then(data => {
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
const deleteAlbum = (req,res,next) => {
    Albums.destroy({
        where: {
          id: req.params.id
        }
    }).then(function(){
        res.send({'message' : "Album Deleted Successfully."})
    });
}
const getUserAlbums = (req,res,next) => {
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
    Albums.findAndCountAll({
        where : {
            user_id : req.params.id
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
module.exports = { getAllAlbums , getSignleAlbum, updateAlbum , createAlbum ,deleteAlbum,getUserAlbums}