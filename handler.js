'use strict';

const ejs = require("ejs");
const fs = require('fs');

const csrf = require('./middlewares/csrf');

const serverless = require('serverless-http');
const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const secretKey = "secretString";

app.get('/contact', csrf.protection(secretKey), function (req, res) {
  const html = fs.readFileSync("views/contact.ejs", 'utf-8');
  res.send(ejs.render(html, {hello: "Enjoy!", token: req.token}));
});

app.post('/contact', csrf.verify(secretKey), function (req, res) {
  console.log(req);
  res.redirect('/contact/complete');
});

app.get('/contact/complete', function (req, res) {
  const html = fs.readFileSync("views/complete.ejs", 'utf-8');
  res.send(html);
});

module.exports.main = serverless(app);
