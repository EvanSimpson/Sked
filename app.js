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
  db = mongojs(process.env.MONGOLAB_URI || process.env.SKED_MONGOLAB || 'localhost/sked');
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
    store: new MongoStore({
      url: process.env.MONGOLAB_URI || process.env.SKED_MONGOLAB || 'localhost/sked'
    })
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

var calparse = require('./public/javascripts/parse.js');
var ical = require('ical-generator');


app.get('/download', function (req, res) {
  calparse.parseAll(req.query.string, function (event) {
    cal = ical();

    cal.setDomain('typecal.herokuapp.com');

    console.log(event);

    cal.addEvent({
        start: event.event.startdate,
        end: event.event.enddate,
        summary: event.event.description,
        description: event.event.description,
        location: ''
    });

    cal.serve(res);
  });
})
app.post('/event/update', function(req, res){
	db.events.update();
});
app.del('/event/delete', function(req, res){
	db.events.remove();
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
