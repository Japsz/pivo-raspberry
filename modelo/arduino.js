const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const parser = port.pipe(new Readline({ delimiter: '\n' }));

function setConnection(port){
    if(port == null){
        port = '/dev/ttyACM0';
    };
    const finalPort = new SerialPort(port, { baudRate: 9600 });
    // Read the port data
    finalPort.on("open", () => {
        $("#footerdiv").html("puerto serial abierto");
    });

    finalPort.on('data', data =>{
        $("#maindiv").html(data);
    });
}
