const router = require('express').Router();
const {
  getUsers, getCurrentUser, createUser, updateUserDescription, updateUserAvatar, login, getMyUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getCurrentUser);
router.get('/me', getMyUser);
router.post('/signup', createUser);
router.post('/signin', login);
router.patch('/me', updateUserDescription);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
