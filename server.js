const express = require('express');
const userRouter = require('./users/userRouter.js')
const colors = require('colors')

const server = express();

server.use(express.json())

server.use(logger)

server.use(process.env.APIROOT, userRouter) //'/api/users'

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  const date = new Date().toDateString()
  const time = new Date().toLocaleTimeString()
  console.log(`Sent a ` + `${req.method}`.bold.underline.magenta + ` request to` + ` '${req.url}'`.bold.yellow + ` on` + ` ${date}`.green + ` at ` + `${time}`.green)
  next()
};

module.exports = server;
