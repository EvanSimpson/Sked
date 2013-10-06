/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongojs = require('mongojs')
  , moment = require('moment')
  , MongoStore = require('connect-mongo')(express);

var app = express(), db;

app.configure(function () {
  db = mongojs(process.env.MONGOLAB_URI || 'olinapps-quotes', ['quotes']);
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('secret', process.env.SESSION_SECRET || 'terrible, terrible secret')
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(app.get('secret')));
  app.use(express.session({
    secret: app.get('secret'),
    // store: new MongoStore({
    //   url: process.env.MONGOLAB_URI || process.env.SKED_MONGOLAB
    // })
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
  app.set('host', 'localhost:3000');
  app.use(express.errorHandler());
});


app.get('/', function(req, res){
  res.render('index', { title: 'Sked' });
});
app.get('/month/:year/:month', function(req, res){
	var date = moment({year:req.params.year, month:req.params.month});
	res.render('month', {"month": date.format("MMMM"), "back":date.subtract("M", 1).month(), "forward":date.add("M", 1).month(), "year":date.year()});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
