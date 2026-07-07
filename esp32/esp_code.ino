#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <DHT.h>


#define DHTPIN 4
#define DHTTYPE DHT22


const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";


// AWS IoT Core endpoint
const char* mqtt_server = "YOUR_AWS_IOT_ENDPOINT";


// Thing name in AWS IoT Core
const char* thingName = "ESP32_DHT22";


WiFiClientSecure espClient;
PubSubClient client(espClient);

DHT dht(DHTPIN, DHTTYPE);


// Root CA Certificate
const char AWS_ROOT_CA[] PROGMEM = R"EOF(
YOUR_AMAZON_ROOT_CA_HERE
)EOF";

// Device Certificate
const char DEVICE_CERT[] PROGMEM = R"EOF(
YOUR_DEVICE_CERTIFICATE_HERE
)EOF";


// Private Key
const char PRIVATE_KEY[] PROGMEM = R"EOF(
-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----
)EOF";


void connectWiFi()
{
  Serial.print("Connecting WiFi");

  WiFi.begin(ssid,password);

  while(WiFi.status()!=WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected");
}



void connectMQTT()
{
  while(!client.connected())
  {
    Serial.print("Connecting AWS IoT...");

    if(client.connect(thingName))
    {
      Serial.println("Connected!");
    }
    else
    {
      Serial.print("Failed ");
      Serial.println(client.state());
      delay(2000);
    }
  }
}



void setup()
{
  Serial.begin(115200);

  dht.begin();


  connectWiFi();


  // AWS certificates
  espClient.setCACert(AWS_ROOT_CA);
  espClient.setCertificate(DEVICE_CERT);
  espClient.setPrivateKey(PRIVATE_KEY);



  client.setServer(mqtt_server,8883);


  connectMQTT();
}



void loop()
{

  if(!client.connected())
  {
    connectMQTT();
  }


  client.loop();



  float temp=dht.readTemperature();
  float hum=dht.readHumidity();


  if(isnan(temp)||isnan(hum))
  {
    Serial.println("DHT failed");
  }
  else
  {

    String payload =
    "{\"temperature\":"
    +String(temp)
    +",\"humidity\":"
    +String(hum)
    +"}";


    client.publish(
      "sensor/data",
      payload.c_str()
    );


    Serial.println(payload);

  }


  delay(3000);

}
