'use strict';

const jwt = require('jsonwebtoken');
const uuidv1 = require('uuid/v1');

module.exports.protection = (secret) => (req, res, next) => {
  const uuidToken = uuidv1();

  const token = jwt.sign({
    uuid: uuidToken
  }, secret, { expiresIn: '3h' });
  res.cookie('uuid', uuidToken);
  req.token = token;
  next();
};

module.exports.verify = (secret) => (req, res, next) => {
  if (!req.cookies.uuid) {
    res.status(400).send('uuid is not found');
    return;
  }
  console.log(req.body.token);
  if (!req.body.token) {
    res.status(400).send('token is not found');
    return;
  }  

  let jwtToken;
  try {
    jwtToken = jwt.verify(req.body.token, secret);
  } catch (e) {
    res.status(400).send("token invalid");
    return;
  }
  if (jwtToken.uuid !== req.cookies.uuid) {
    res.status(400).send("token invalid");
    return;
  }
  next(); 
}
