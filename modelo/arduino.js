const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });
// Read the port data
port.on("open", function(){
    $("#footerdiv").html("puerto serial abierto");
});

port.on('data', function(data){
    $("#maindiv").html(data);
});
port.on('readable', function () {
    $("#maindiv").html('Data:', port.read())
})
// Open errors will be emitted as an error event
port.on('error', function(err) {
    $("#footerdiv").html('Error: ', err.message)
});
const parser = port.pipe(new Readline({ delimiter: '\n' }));
$("#superfooter").html("arduino.js hizo esto");

