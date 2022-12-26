//  external imports
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

//  internal imports
const userRouter = require('./routes/user.router');
const adminRouter = require('./routes/admin.router');
const morgan = require('morgan');

const app = express();
require('dotenv').config();
// require('./config/passport');

app.use(
  cors({
    origin: true, // use your actual domain name (or localhost), using * is not recommended
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'X-Requested-With',
      'Accept',
      'x-client-key',
      'x-client-token',
      'x-client-secret',
      'Authorization'
    ],
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), {
  flags: 'a'
});

app.use(morgan('combined', { stream: accessLogStream }));

// app.set('trust proxy', 1); // trust first proxy
// app.use(
//   session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGO_URL,
//       collectionName: 'sessions'
//     }),
//     cookie: { secure: true, maxAge: 86400000 }
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

app.use('/', userRouter);
app.use('/', adminRouter);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  console.log(err);
  return res.json(err).end();
});

module.exports = app;
