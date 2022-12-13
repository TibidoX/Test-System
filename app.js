var express = require("express");
var path = require("path");
var indexRouter = require('./routes/index');
var Sessions = require('./Private/sessions');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(Sessions);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'private')));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', indexRouter);

module.exports = app;