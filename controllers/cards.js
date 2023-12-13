const Card = require('../models/cards');
const {
  BAD_REQUEST,
  SERVER_ERROR,
  NOT_FOUND,
  STATUS_CREATED,
  STATUS_OK,
} = require('../errors/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      return Card.findById(card._id)
        .populate('owner')
        .then((cards) => res.status(STATUS_CREATED).send(cards));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.deleteCard = (req, res) => Card.findByIdAndDelete(req.params.cardId)
  .then((card) => {
    if (!card) {
      return res.status(NOT_FOUND).send({ message: `Карточка с указанным id: ${req.params.cardId} не найдена` });
    } return res.status(STATUS_OK).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    }
  });

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).then((card) => {
  if (!card) {
    return res.status(NOT_FOUND).send({ message: `Карточка с указанным id: ${req.params.cardId} не найдена` });
  } return res.status(STATUS_OK).send(card);
})
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
    } else {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    }
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).then((card) => {
  if (!card) {
    return res.status(NOT_FOUND).send({ message: `Карточка с указанным id: ${req.params.cardId} не найдена` });
  } return res.status(STATUS_OK).send(card);
})
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
    } else {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    }
  });
