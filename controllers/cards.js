const mongoose = require('mongoose').default;
const Card = require('../models/cards');
const {
  BAD_REQUEST,
  SERVER_ERROR,
  NotFound,
  STATUS_CREATED,
  STATUS_OK,
} = require('../errors/errors');

const { CastError, ValidationError } = mongoose.Error;

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
      Card.findById(card._id)
        .populate('owner')
        .then((cards) => res.status(STATUS_CREATED).send(cards));
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.deleteCard = (req, res) => Card.findByIdAndDelete(req.params.cardId)
  .orFail(() => new NotFound(`Карточка с указанным id: ${req.params.cardId} не найдена`))
  .then((card) => res.status(STATUS_OK).send(card))
  .catch((err) => {
    if (err instanceof CastError) {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
  });

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).orFail(() => new NotFound(`Карточка с указанным id: ${req.params.cardId} не найдена`))
  .then((card) => res.status(STATUS_OK).send(card))
  .catch((err) => {
    if (err instanceof CastError) {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
    } return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).orFail(() => new NotFound(`Карточка с указанным id: ${req.params.cardId} не найдена`))
  .then((card) => res.status(STATUS_OK).send(card))
  .catch((err) => {
    if (err instanceof CastError) {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
    } return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
  });
