const raspi = require('raspi');
const Serial = require('raspi-serial').Serial;

raspi.init(() => {
    var serial = new Serial();
    serial.open(() => {
    serial.on('data', (data) => {
    console.log(data);
});
serial.write('Hello from raspi-serial');
});
});