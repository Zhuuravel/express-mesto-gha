const router = require('express').Router();
const {
  getUsers, getCurrentUser, updateUserDescription, updateUserAvatar, getMyUser,
} = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');
const { reg } = require('../utils/isLink');

router.get('/me', getMyUser);
router.get('/', getUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getCurrentUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserDescription);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(reg).required(),
  }),
}), updateUserAvatar);

module.exports = router;
