require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose').default;
const { NOT_FOUND } = require('./errors/errors');
const routes = require('./routes');

const { PORT } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6571d04d7b1ebc844b5c581e', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
  });

app.use(routes);

app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Неверный путь' });
});

app.listen(PORT, () => {
  console.log('Server started on port 3000');
});
