var conf = require('./configuration.js');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var database = require('./database/mongoStartup');
var adminRoleRoute = require('./modules/adminRole/adminRoleRoute');
var socialProviderRoute = require('./modules/socialProvider/socialProviderRoute');
var userRoute = require('./modules/user/userRoute');
var mettRoute = require('./modules/mett/mettRoute');

//Create API Server
var server = express();
server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(session({ secret: 'huzasdfas899332hufsd0ß2#324!' , resave: true, saveUninitialized: false}));
server.use(passport.initialize());
server.use(passport.session());
server.use(cookieParser());

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", conf.CORS.allowedHost);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept,access-control-allow-headers," +
      "access-control-allow-origin, user, Access-Control-Expose-Headers, Access-Control-Allow-Methods");
  res.header("Access-Control-Allow-Credentials","true");
  res.header("Access-Control-Allow-Methods","GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Expose-Headers","accept, authorization, content-type, x-requested-with, jwt, user");
  next();
});

// Here comes all the routes
adminRoleRoute(server);
socialProviderRoute(server);
userRoute(server);
mettRoute(server);

database.startMongoServer();


server.listen(conf.serverPort, function (err) {
    if (err)
        console.error(err)
    else
        console.log('server listen to port : ' + conf.serverPort)
});

process.on('uncaughtException', function (err) {
    console.log(err);
    throw (err);
});
