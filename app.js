const express = require('express');
const mongoose = require('mongoose').default;
const routes = require('./routes');
const {
  createUser, login,
} = require('./controllers/users');
const { auth } = require('./middlewares/auth')
const NotFound = require('./errors/NotFound');
const { celebrate, Joi, errors } = require('celebrate');
const { urlValid } = require('./utils/validation');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlValid),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
  });

app.use(routes);

app.use('*', (req, res, next) => {
  return next(new NotFound('Неверный путь'));
});

app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
