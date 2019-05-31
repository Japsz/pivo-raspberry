var ejs = require('ejs');

function pivoArduino(socket) {
    this.socket = socket;
    this.socket.on('calibrator', this.onSocketConnect.bind(this));
    this.socket.on('flowread', this.onDatos.bind(this));
    this.socket.on('flowfreq', this.onDatosCalibrate.bind(this));
    this.socket.on('status',this.onSetState.bind(this));
    this.socket.on('error',this.onError.bind(this));
    this.lastPour = 0.0;
    this.state = 'inactivo';
};
pivoArduino.prototype.onError  = function(data){
    alert(data);
};
pivoArduino.prototype.onSocketConnect  = function(data){
    $("#nav-ddwn").html("Calibrator: " + data);
};
pivoArduino.prototype.onDatos = function(data){
    if(parseFloat(data) != this.lastPour){
        this.lastPour = parseFloat(data);
        $("#currentPour").html(data);
        $("#currentPour").append("<small>cc</small>");
    }
};
pivoArduino.prototype.onDatosCalibrate = function(data){
    $("#currentPour").html(data);
    $("#currentPour").append("<small>revs</small>");
};
pivoArduino.prototype.onSetState  = function(state){
    state.trim();
    if(this.state != state){
        this.state = state;
        ejs.renderFile("views/status.ejs",{state:this.state},function (err,html) {
            if(err){
                alert("error al renderizar");
                console.log(err);
            } else {
                $("#mainer").html(html);
            }
        });
    }
};

