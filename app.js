const express = require('express');
const mongoose = require('mongoose').default;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6571d04d7b1ebc844b5c581e', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('MongoDB connected');
  });

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
