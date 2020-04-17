const router = require('express').Router();
const registerValidator = require('../validator/authValidator/signupvalidator')
const loginValidator = require('../validator/authValidator/loginValidator')
const {
    signupGetController,
    signupPostController,
    loginGetController,
    loginPostController,
    logoutController,
    changePssswordGetController,
    changePssswordPostController,
    deleteGetController,
    deletePostController
} = require('../controllers/authController');

const {isUnAuthenticate} = require('../middleware/authMiddleware')
const { isAuthenticate  }=require('../middleware/authMiddleware')

router.get('/signup',signupGetController);
router.post('/signup',registerValidator,signupPostController);

router.get('/login',loginGetController);
router.post('/login',loginValidator,loginPostController);

router.get('/change-Password',isAuthenticate,changePssswordGetController);
router.post('/change-Password',isAuthenticate,changePssswordPostController);

router.get('/delete',isAuthenticate,deleteGetController);
router.post('/delete',isAuthenticate,deletePostController);

router.get('/logout',logoutController)



module.exports = router;