require('dotenv').config();
const mongoose = require('mongoose').default;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  BAD_REQUEST,
  SERVER_ERROR,
  NOT_FOUND,
  STATUS_CREATED,
  STATUS_OK,
} = require('../errors/errors');
const User = require('../models/users');

const { CastError, ValidationError } = mongoose.Error;
const { JWT_SECRET = 'JWT_SECRET' } = process.env;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: `Пользователь по id: ${req.params.userId} не найден` });
      } return res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.getMyUser = (req, res) => {
  const { _id } = req.user;
  User.find({ _id })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: `Пользователь по id: ${ _id } не найден` });
      } return res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

// module.exports.createUser = (req, res) => {
//   const {
//     name, about, avatar, email, password,
//   } = req.body;
//   if (!email || !password) {
//     return res.status(BAD_REQUEST).send({ message: 'Email и пароль обязательны!' });
//   }
//   bcrypt.hash(password, 10)
//     .then((hash) => {
//       User.create({
//         name, about, avatar, email, password: hash,
//       }).then((user) => res.status(STATUS_CREATED).send(user));
//     })
//     .catch((err) => {
//       console.log(err.name);
//       if (err.name === 'MongoServerError' && err.code === 11000) {
//         return res.status(409).send({ message: 'Такой email уже используется' });
//       } if (err instanceof ValidationError) {
//         return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
//       } return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
//     });
// };

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    return res.status(BAD_REQUEST).send({ message: 'Email и пароль обязательны!' });
  } User.create({
    name, about, avatar, email, password,
  }).then((user) => res.status(STATUS_CREATED).send(user))
    .catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(409).send({ message: 'Такой email уже используется' });
      } return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.updateUserDescription = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
