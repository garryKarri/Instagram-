require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const hbs = require('hbs');
const path = require('path');

const session = require('express-session'); // создает сессии на экпрессе
const FileStore = require('session-file-store')(session); // создаёт папку sessions для хранения наших сессий;

const PORT = process.env.PORT ?? 3000; // ??-оператор нулевого слияния это логический оператор, возвращающий значение правого операнда, если значение левого операнда содержит null или undefined
const indexRouter = require('./routes/indexRouter');
const postRouter = require('./routes/postRouter');
// const jokeRouter = require('./routes/jokeRouter');
const userRouter = require('./routes/userRouter');
const putRouter = require('./routes/putRouter');

const app = express();
hbs.registerPartials(path.join(process.env.PWD, 'views/partials'));

app.set('view engine', 'hbs'); // Сообщаем express, что в качестве шаблонизатора используется "hbs".
app.set('views', path.join(process.env.PWD, 'views')); // Сообщаем express, что hbs находятся в папке views --> "ПапкаПроекта/views".

app.use(morgan('dev')); // Подключаем middleware morgan с режимом логирования "dev", чтобы для каждого HTTP-запроса на сервер в консоль выводилась информация об этом запросе.
app.use(express.static(path.join(process.env.PWD, 'public')));
app.use(express.urlencoded({ extended: true })); // парсит тело запросов из формы, создавая пару ключ/значение;
app.use(express.json()); // преобразует переданный на сервер json в обычный объект;

app.use( // после прохождения через эту midleware у объекта request появляется ключ session
  session({ // session принимает в себя объект настроек
    name: 'sid', // имя сессионной куки
    store: new FileStore(), // хранилище для куков - папка с файлами
    secret: process.env.SECRET, // строка для шифрования сессии (хеширование)
    resave: false, // сессия не сохраняется, если не было изменений
    saveUninitialized: false, // не сохраняем сессию, если она пустая
    cookie: { httpOnly: true }, // куку нельзя будет изменить с браузера, кука доступна для чтения и изменения только на сервере;
  }),
);

app.use((req, res, next) => { // middleware для формирования нового ключа user в объекте res.locals
  res.locals.user = req.session?.user; // положим в объект res.locals новый ключ user, значением которого будет объект req.session.user, который мы формировали в userRouter.js  на этапах регистрации и авторизации (req.session.user = { id:currentUser.id, name:currentUser.name})
  next();
});

app.use('/', indexRouter);
app.use('/post', postRouter);
// app.use('/joke', jokeRouter);
app.use('/user', userRouter);
app.use('/put', putRouter);

app.use((req, res) => { // заглушка , на случай, если не будет требуемого адреса
  res.status(404).send('ooops');
});

app.listen(PORT, () => {
  console.log('server start on', PORT);
});
