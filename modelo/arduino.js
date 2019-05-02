const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const finalPort = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
const parser = finalPort.pipe(new Readline({ delimiter: '\n' }));
// Read the port data
parser.on("open", () => {
    $("#footerdiv").html("puerto serial abierto");
});

parser.on('data', data =>{
    $("#maindiv").html(data);
});
