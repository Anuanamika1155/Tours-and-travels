const express = require('express')
const user = require('../Controllers/userController.js')
const {verifyToken} = require('../Utils/verifyToken.js')
const router = express.Router()

router.put('/:id',user.updateUser);
router.delete('/:id', user.deleteUser)
router.get('/:id', user.getSingleUser)
router.get('/', user.getAllUser)
router.post('/login', user.UserLogin)
router.post('/register', user.userRegister)
router.get('/profile', verifyToken, user.getCurrentUser);

module.exports = router;