
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , models = require('./model')
  , mongoose = require('mongoose')
  , formidable = require('formidable');

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  //CSS
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  // When application gets a post the router looks at the url and does the right thing
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// different configuration
// testing available
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/home', routes.location_refresh);
app.post('/update', routes.update_score);
app.get('/splash_screen',routes.splash_screen); // For Splash Screen (views/splashscren)
app.post('/splash_screen',routes.splash_screen_post); // For Splash Screen (views/splashscren)

app.get('/test', routes.test);

//Picture upload
app.get('/upload', routes.picture);
app.post('/upload', routes.upload);

//User registration
app.get('/registration', routes.registration);
app.post('/registration', routes.register_new);

//Feedback
app.post('/feedback', routes.feedback);

//Comments
app.get('/picture/:id', routes.get_post);
app.post('/comment', routes.comment)

// Server startup
app.listen(3000);
// Database connection
mongoose.connect('mongodb://localhost/breakit');
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
