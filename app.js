const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

app.get('/', (req, res, next) => {
  res.render('index', {
    pageTitle: 'Сеть пансионатов "Ласточка"',
    pageDescription: 'Сеть пансионатов для пожилых людей "Ласточка"'
  });
});

app.use((req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Страница не найдена',
    pageDescription: 'По этой ссылке ничего нет. Ошибка 404.'
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});