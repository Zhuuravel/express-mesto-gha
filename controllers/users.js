const User = require('../models/users');
const { BAD_REQUEST, SERVER_ERROR, NOT_FOUND } = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.getCurrentUser = (req, res) => {
  console.log(req.params);
  User.findById(req.params.userId)
    .then((user) => {
      console.log(user);
      if (!user) {
        res.status(NOT_FOUND).send({ message: `Пользователь по id: ${req.params.userId} не найден` });
      } else res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      }
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
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({ message: `Пользователь по id: ${req.user._id} не найден` });
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
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
      upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({ message: `Пользователь по id: ${req.user._id} не найден` });
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};
