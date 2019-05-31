//variables para capturar datos desde raspberry
const byte DATA_MAX_SIZE = 32;
char data[DATA_MAX_SIZE]; 
//variables para medicion del flujometro
volatile int flow_frequency; // Measures flow sensor pulses
float l_hour; // Calculated litres/hour
unsigned char flowsensor = 2; // Sensor Input
unsigned char relay = 13; // Relay Output
unsigned long currentTime;
unsigned long cloopTime;
float waterqty = 0.0;
//Variables de estado 
String state,token; 
float calibrator;

void flow () // Interrupt function
{
   flow_frequency++;
}

void setup() {
  pinMode(flowsensor, INPUT_PULLUP);
  pinMode(relay, OUTPUT);
  // put your setup code here, to run once:
  Serial.begin(9600);
  attachInterrupt(digitalPinToInterrupt(flowsensor), flow, RISING); // Setup Interrupt
  digitalWrite(relay,HIGH);
  sei(); // Enable interrupts
  state = "inactivo";
  calibrator = 1.0;
  currentTime = millis();
  cloopTime = currentTime;
}

void receiveData() {
  static char endMarker = '\n'; // message separator
  char receivedChar;     // read char from serial port
  int ndx = 0;          // current index of data buffer
  String errtoken;
  // clean data buffer
  memset(data, 32, sizeof(data));
  // read while we have data available and we are
  // still receiving the same message.
  while(Serial.available() > 0) {
    receivedChar = Serial.read();
    if (receivedChar == endMarker) {
      data[ndx] = '\0'; // end current message
      if(state.compareTo(String("calibrate")) == 0 && flow_frequency != 0){
        calibrator = String(data).toInt()/float(flow_frequency);
        state = "inactivo";
        flow_frequency = 0;
      } else {
        state = String(data);        
      }
      return;
    }
    // looks like a valid message char, so append it and
    // increment our index
    data[ndx] = receivedChar;
    ndx++;
    // if the message is larger than our max size then
    // stop receiving and clear the data buffer. this will
    // most likely cause the next part of the message
    // to be truncated as well, but hopefully when you
    // parse the message, you'll be able to tell that it's
    // not a valid message.
    if (ndx >= DATA_MAX_SIZE) {
      break;
    }
  }
  // no more available bytes to read from serial and we
  // did not receive the separato. it's an incomplete message!
  errtoken = "error@@mensaje no recibido - ";
  errtoken.concat(String(data));
  Serial.println(errtoken);
  memset(data, 32, sizeof(data));
}

void loop() {
  
  // put your main code here, to run repeatedly:
  if(Serial.available() > 0){
    receiveData();
  }
  // Enviar info de estado
  token = "status@@";
  token.concat(state);
  Serial.println(token); 
  token = "calibrator@@";
  token.concat(String(calibrator));
  Serial.println(token); 
  currentTime = millis();
  if(state.compareTo(String("inactivo")) == 0){
      flow_frequency = 0;
      waterqty = 0.0;
      digitalWrite(relay,LOW);
  } else if (state.compareTo(String("leyendo")) == 0){
    // Every second, calculate and print litres/hour
    waterqty = flow_frequency*calibrator;
    token = "flowread@@";
    token.concat(String(waterqty));
    Serial.println(token);
  } else if(state.compareTo(String("detenido")) == 0){
    //resets waterqty and stops flow by relay
      flow_frequency = 0;
      waterqty = 0.0;
      digitalWrite(relay,LOW);
  } else if(state.compareTo(String("abrir")) == 0){
    //Opens relay, resets waterqty and start reading
    flow_frequency = 0;
    digitalWrite(relay,HIGH);    
    waterqty = 0.0;
    state= "leyendo";
  } else if(state.compareTo(String("calibrate")) == 0){
    digitalWrite(relay,HIGH);    
    token = "flowfreq@@";
    token.concat(String(flow_frequency));
    Serial.println(token);
  } else {
    Serial.println("error@@Estado invalido.");
    state = "inactivo";
  }
  delay(500);
}
