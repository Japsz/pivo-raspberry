const server = require('http').createServer();
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });

const parser = port.pipe(new Readline({ delimiter: '\n' }));

port.on('error', function(e){
    console.log(e)
})

server.listen(3001,function(){
	console.log("Server listening on port 3001");
});

const io = require('socket.io')(server);

io.on('connection', function(client){
	console.log("conexion establecida");
    client.on('write',function(data){
        if(data != "" && data != null){
            port.write(data + '\n', function(err){
                if (err) {
                  return console.log('Error on write: ', err.message);
                }
                console.log('message written');
            });
        }
    });
    client.on('startDraft', function(){
        console.log("Escribiendo apertura en arduino");
        port.write('abrir\n', function(err){
            if (err) {
                return console.log('Error on write: ', err.message);
            } else {
                console.log('message written');
            }
        });
    });
    client.on('stopDraft', function(){
        console.log("Escribiendo cierre en arduino");
        port.write('detenido\n', function(err){
            if (err) {
                return console.log('Error on write: ', err.message);
            } else {
                console.log('message written');
            }
        });
    });
});
parser.on('open',function(){
    console.log("conexion con arduino realizada");
});
parser.on('data',function(data){
    var parsed = data.split('@@');
	io.emit(parsed[0],parsed[1]);
});
