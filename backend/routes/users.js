var router = require('express').Router();
const userController = require('../controllers/user');
const userValidation = require('../validations/user');


router.get('/',userController.getAllUsers )
router.get('/:id', userController.getOneUser)
router.put('/:id', userController.updateUser);
router.post('/',userValidation.createUser, userController.createUser);
router.delete('/:id',userController.deleteUser)

module.exports = router;
