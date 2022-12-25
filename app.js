//  external imports
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');

//  internal imports
const userRouter = require('./routes/user.router');
const adminRouter = require('./routes/admin.router');
const ResponseMsg = require('./libs/responseMsg');

const app = express();
require('dotenv').config();
require('./config/passport');

app.use(
  cors({
    origin: 'http://localhost:3000', // use your actual domain name (or localhost), using * is not recommended
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

// app.set('trust proxy', 1); // trust first proxy
// app.use(
//   session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGO_URL,
//       collectionName: 'sessions'
//     })
//     // cookie: { secure: true }
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

app.use('/', userRouter);
app.use('/', adminRouter);

app.use((err, req, res, next) => {
  console.log(err.message);
  const errObj = new ResponseMsg(true, err.message);
  res.json(errObj);
});

module.exports = app;
