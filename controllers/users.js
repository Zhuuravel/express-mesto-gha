const mongoose = require('mongoose').default;
const User = require('../models/users');
const {
  BAD_REQUEST,
  SERVER_ERROR,
  NOT_FOUND,
  STATUS_CREATED,
  STATUS_OK,
} = require('../errors/errors');

const { CastError, ValidationError } = mongoose.Error;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.params.userId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: `Пользователь по id: ${req.params.userId} не найден` });
      } return res.status(STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CREATED).send({ data: user }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
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
//   module.exports.updateUserDescription = (req, res) => {
//   const { name, about } = req.body;
//   const userId = req.user._id;
//   User.findByIdAndUpdate(userId, { name, about }, { new: 'true', runValidators: true })
//     .then((user) => res.status(200).send(user))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         res.status(400).send({ message: err.message });
//       } else {
//         res.status(500).send({ message: 'На сервере произошла ошибка' });
//       }
//     });
// };

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
