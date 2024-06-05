#include <BH1750.h>
#include <DHT.h>
#include <Wire.h>
#include <FirebaseESP32.h>
#include <addons/RTDBHelper.h>
#include <WiFiManager.h>
#include <LiquidCrystal_I2C.h>

//--------------------------------------------------Sensor--------------------------------------------------------//
#define DHTPIN 19
#define DHTTYPE DHT11
#define fan 4
#define pump 2
#define bulb 5

int i = 1; //change display LCD


BH1750 lightMeter;
DHT dht(DHTPIN, DHTTYPE);


//define LCD
int lcdColumns = 16;
int lcdRows = 2;
LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows);

#define DATABASE_URL "" //firebase URL
FirebaseData FirebaseData1; 
FirebaseData FirebaseData2;      //3 devices 
// FirebaseData FirebaseData3; 
// FirebaseData FirebaseData4; //Khai báo object fbdo để lưu trữ dữ liệu Firebase

// FirebaseData FirebaseData7;
// FirebaseData FirebaseData5; //3 sensors
// FirebaseData FirebaseData6;

// FirebaseData FirebaseData9;
// FirebaseData FirebaseData8; 
// FirebaseData FirebaseData10;      //6 condition
// FirebaseData FirebaseData11; 
// FirebaseData FirebaseData13;
// FirebaseData FirebaseData12; 

FirebaseAuth auth; //Khai báo object auth để xác thực với Firebase
FirebaseConfig config;
void setup() {
  Serial.begin(115200);
  dht.begin();

  //....................Pinmode Device................
  pinMode(pump, OUTPUT);
  pinMode(fan, OUTPUT);
  pinMode(bulb, OUTPUT);

  //......................set up LCD..........................................
  lcd.init();
  // turn on LCD backlight                      
  lcd.backlight();


  Wire.begin(21,22);
  lightMeter.begin();
  WiFiManager wm;
    //wm.resetSettings();   //Xác định việc có cài đặt lại wifi hay không
    bool res;
    res = wm.autoConnect("Setup","password"); // password protected ap
    if(!res) {
        Serial.println("Failed to connect");
        // ESP.restart();
    } 
    else {
        //if you get here you have connected to the WiFi    
        Serial.println("connected...yeey :)");
    }
//----------------------------------------------Firebase----------------------------------------------------//   
    Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION); //Khởi tạo kết nối tới Firebase
    config.database_url = DATABASE_URL;
    config.signer.test_mode = true;
    Firebase.reconnectWiFi(true);
    Firebase.begin(&config, &auth);
}

void loop() {
int Temp_max, Temp_min,Humi_max, Humi_min,Light_max, Light_min; //condition for auto
int temp, humi, light; //sensor value
static String pump_web, bulb_web,fan_web; //button ON OFF on Web  


  temp = dht.readTemperature(); //read temperature DHT11
  humi = dht.readHumidity(); //read humidity DHT11
  light = lightMeter.readLightLevel(); //read light from BH1750

  Serial.println(temp);
  Serial.println(humi);
  Serial.println(light);

//............................DISPLAY LCD............................//
  i++; 
  if (i%2 ==0){
    //.....................display temperature................................
    lcd.setCursor(0, 0);
    lcd.print("Temp: ");
    lcd.print(temp);
    lcd.print(" oC");
    
    //.....................display humidity....................................
    lcd.setCursor(0, 1);
    lcd.print("Hum: ");
    lcd.print(humi);
    lcd.print(" %");
    
  } else {
    //.....................display Light.....................................
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Light: ");
    lcd.print(light);
    lcd.print(" lux");  
  }


//..........................UPDATE SENSOR VALUE TO WEB............................//
  Firebase.setInt(FirebaseData1, "/Sensor/Temperature", temp);
  delay(100);
  Firebase.setInt(FirebaseData1, "/Sensor/Humidity", humi);
  delay(100);
  Firebase.setInt(FirebaseData1, "/Sensor/Bright", light);
  delay(100);


//..........................GET STATUS DEVICE FROM WEB............................//
  Firebase.getString(FirebaseData1, "/Device/Pump");
  pump_web = FirebaseData1.stringData(); //get signal from web
  Firebase.getString(FirebaseData1, "/Device/Bulb");
  bulb_web = FirebaseData1.stringData();
  Firebase.getString(FirebaseData1, "/Device/Fan");
  fan_web = FirebaseData1.stringData();


//..........................GET CONDITION............................//
  Firebase.getString(FirebaseData1,"/Set Value/Temp/Max");
  Temp_max = FirebaseData1.intData();
  Firebase.getString(FirebaseData1,"/Set Value/Temp/Min");
  Temp_min = FirebaseData1.intData();
  
  Firebase.getString(FirebaseData1,"/Set Value/Humi/Max");
  Humi_max = FirebaseData1.intData();
  Firebase.getString(FirebaseData1,"/Set Value/Humi/Min");
  Humi_min = FirebaseData1.intData();
  
  Firebase.getString(FirebaseData1,"/Set Value/Light/Max");
  Light_max = FirebaseData2.intData();
  Firebase.getString(FirebaseData1,"/Set Value/Light/Min");
  Light_min = FirebaseData1.intData();



  if (bulb_web == "ON") {
      digitalWrite(bulb,HIGH);
  }
  if (bulb_web == "OFF") {
      digitalWrite(bulb,LOW);
  }

  //...................fan from web...................................
  if (fan_web == "ON") {
      digitalWrite(fan,HIGH);
  }
  if (fan_web == "OFF") {
      digitalWrite(fan,LOW);
  }

  //...................pump from web...................................
  if (pump_web == "ON") {
      digitalWrite(pump,HIGH);
  }
  if (pump_web == "OFF") {
      digitalWrite(pump,LOW);
  }
  delay(300);

  // automode(Temp_max, Temp_min,Humi_max, Humi_min,Light_max, Light_min, temp, humi, light)
  // delay(300);

    //.................................TEMPERATURE HIGHER THAN TEMPERATURE SET VALUE ....................................//
  if(temp > Temp_max){
    digitalWrite(fan,HIGH);
    delay(200);
    digitalWrite(pump,HIGH);
    delay(200);
  } else {
    digitalWrite(fan,LOW);
    delay(200);
    digitalWrite(pump,LOW);
    delay(200);
    digitalWrite(bulb,LOW);
    delay(200);
  }

//.................................TEMPERATURE LOWER THAN TEMPERATURE SET VALUE ....................................//
  if(temp < Temp_min){
    digitalWrite(bulb,HIGH);
    delay(200);
  } else {
    digitalWrite(fan,LOW);
    delay(200);
    digitalWrite(pump,LOW);
    delay(200);
    digitalWrite(bulb,LOW);
    delay(200);
  }

//.................................HIMIDITY HIGHER THAN HIMIDITY SET VALUE ....................................//
  if(humi > Humi_max){
    digitalWrite(fan,HIGH);
    delay(200);
    digitalWrite(bulb,HIGH);
    delay(200);
  } else {
    digitalWrite(fan,LOW);
    delay(200);
    digitalWrite(pump,LOW);
    delay(200);
    digitalWrite(bulb,LOW);
    delay(200);
  }

//.................................HUMIDITY LOWER THAN HUMIDITY SET VALUE ....................................//
  if(humi < Humi_min){
    digitalWrite(pump,HIGH);
    delay(200);
  } else {
    digitalWrite(fan,LOW);
    delay(200);
    digitalWrite(pump,LOW);
    delay(200);
    digitalWrite(bulb,LOW);
    delay(200);
  }

//.................................LIGHT LOWER THAN LIGHT SET VALUE ....................................//
 if(light < Light_min){
    digitalWrite(bulb,HIGH);
    delay(200);
  } else {
    digitalWrite(fan,LOW);
    delay(200);
    digitalWrite(pump,LOW);
    delay(200);
    digitalWrite(bulb,LOW);
    delay(200);
  }
}




// void webmode(static String pump_web, bulb_web, fan_web){
//   //..................bulb from web...................................

// }



// void automode(int Temp_max, Temp_min,Humi_max, Humi_min,Light_max, Light_min, temp, humi, light){

// }