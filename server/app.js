const express = require('express');
const server = require('http').createServer(app);


var path = require('path');
var logger = require('morgan');

var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
    name: 'session',
    keys: ['pivo_arduino']
}));
var index = require('./routes/index');
app.get('/',function(req,res){ res.render('index')});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Error');
    err.status = 400;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

server.listen(3001,function(){
	console.log("Server listening on port 3030");
});

const io = require('socket.io')(server);

io.on('connection', function(client){
	console.log("conexion establecida");
	  client.on('entry', function(data){ console.log(data + ' ha entrado') });
});
parser.on('open',function(){
	io.emit('conexion');
	console.log("conexión con arduino exitosa");
});
parser.on('data',function(data){
	io.emit('datos',data);
});
