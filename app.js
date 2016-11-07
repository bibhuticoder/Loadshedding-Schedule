var app = require('express')();
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var scrapper = require('./scrapper');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(require('express').static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.render('index', {
        data:scrapper.allData()
    });
});

app.get('/api/schedule', function (req, res) {
    res.json({
        data: scrapper.allData()
    });
});

scrapper.scrapeData();

var port = process.env.PORT || 3000;
app.listen(port);
console.log("listening to port " + port);