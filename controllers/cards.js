const mongoose = require('mongoose').default;
const Card = require('../models/cards');
const {
  STATUS_CREATED,
  STATUS_OK,
} = require('../errors/errors');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');

const { CastError, ValidationError } = mongoose.Error;

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((cards) => res.status(STATUS_CREATED).send(cards));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => Card.findByIdAndDelete(req.params.cardId)
.then((card) => {
  const userId = req.user._id;
    if (!card) {
      return next(new NotFound(`Карточка с указанным id: ${req.params.cardId} не найдена`));
    } 
    else if (card.owner !== userId) {
      return next(new Forbidden('Попытка удалить чужую карточку!'));
    }
     return res.status(STATUS_OK).send(card);
  })
  .catch(next);

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).then((card) => {
  if (!card) {
    return next(new NotFound(`Карточка с указанным id: ${req.params.cardId} не найдена`));
  } return res.status(STATUS_OK).send(card);
})
  .catch(next);

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).then((card) => {
  if (!card) {
    return next(new NotFound(`Карточка с указанным id: ${req.params.cardId} не найдена`));
  } return res.status(STATUS_OK).send(card);
})
  .catch(next);
