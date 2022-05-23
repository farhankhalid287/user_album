var router = require('express').Router();
const albumsController = require('../controllers/albums');
const albumsValidation = require('../validations/albums');

router.get('/user/:id', albumsController.getUserAlbums )
router.get('/', albumsController.getAllAlbums )
router.get('/:id', albumsController.getSignleAlbum)
router.put('/:id', albumsValidation.updateAlbum, albumsController.updateAlbum);
router.post('/', albumsValidation.createAlbum, albumsController.createAlbum);
router.delete('/:id',albumsController.deleteAlbum) 

module.exports = router;
