import createError from 'http-errors';
import express, { json, urlencoded, static as staticFiles } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import indexRouter from './routes/index.js';
import challengesRouter from './routes/challenges.js';
import commentsRouter from './routes/comments.js';
import Comment from './models/comment.js';

// load models
Comment.sync();

// set up app
const app = express();

// view engine setup
app.set('views', "./views");
app.set('view engine', 'ejs');

// load middlewares
app.use(logger('dev'));
app.use(json());
app.use(cors({ exposedHeaders: "authorization" }));
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(staticFiles("./public"));

// set routes
app.use('/', indexRouter);
app.use('/challenges', challengesRouter);
app.use('/comments', commentsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
