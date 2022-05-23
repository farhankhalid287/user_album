var router = require('express').Router();
const photosController = require('../controllers/photos');
const photosValidations = require('../validations/photos');

router.get('/album/:id', photosController.getAlbumPhotos )
router.get('/', photosController.getAllPhotos )
router.get('/:id', photosController.getSignlePhoto)
router.put('/:id', photosValidations.updatePhoto, photosController.updatePhoto);
router.post('/', photosValidations.createPhoto, photosController.createPhoto);
router.delete('/:id',photosController.deletePhoto) 

module.exports = router;
