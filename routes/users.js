const router = require('express').Router();
const {
  getUsers, getCurrentUser, createUser, updateUserDescription, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getCurrentUser);
router.post('/', createUser);
router.patch('/me', updateUserDescription);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
