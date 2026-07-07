const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mqtt = require("mqtt");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://mongodb:27017/iot_db")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));


// MQTT Connection
const mqttClient = mqtt.connect(
  "mqtts://a20d4hqhhc11j6-ats.iot.us-east-1.amazonaws.com:8883",
  {
    ca: fs.readFileSync("./certs/AmazonRootCA1.pem"),
    cert: fs.readFileSync("./certs/device-certificate.pem.crt"),
    key: fs.readFileSync("./certs/private.pem.key"),

    clientId: "dashboard-server"
  }
);


const dhtSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  timestamp: Date
});

const DhtData = mongoose.model("DhtData", dhtSchema, "dht_data");

// MQTT Events
mqttClient.on("connect", () => {
  mqttClient.subscribe("sensor/data");
});

mqttClient.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    const newData = new DhtData({
      temperature: data.temperature,
      humidity: data.humidity,
      timestamp: new Date()
    });

    await newData.save();
  } catch (err) {
    console.error("Error saving data:", err);
  }
});

// Routes
app.get("/", (req, res) => {
  res.send("IoT Backend Running");
});

app.get("/api/data", async (req, res) => {
  const data = await DhtData.find()
    .sort({ timestamp: -1 })
    .limit(50);

  res.json(data.reverse());
});

app.get("/api/latest", async (req, res) => {
  const latest = await DhtData.findOne().sort({ timestamp: -1 });

  if (!latest) {
    return res.json({ message: "No data yet" });
  }

  const alert =
    latest.temperature > 35
      ? "HIGH_TEMPERATURE"
      : latest.humidity > 80
      ? "HIGH_HUMIDITY"
      : "NORMAL";

  res.json({
    temperature: latest.temperature,
    humidity: latest.humidity,
    timestamp: latest.timestamp,
    alert
  });
});

// Start Server
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
