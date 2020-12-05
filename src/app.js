const createError = require('http-errors');
const express = require('express');

const { hmacAuth } = require('./api/middlewares');
const { commandUserService, queryUserService } = require('./services/users');
const { commandTaskService, queryTaskService } = require('./services/tasks');
const { tasks, users } = require('./api/routes');

const tasksRouter = tasks({ commandTaskService, queryTaskService });
const usersRouter = users({ commandUserService, queryUserService });
const auth = hmacAuth(queryUserService);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/v1/tasks', auth, tasksRouter);
app.use('/v1/users', auth, usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
