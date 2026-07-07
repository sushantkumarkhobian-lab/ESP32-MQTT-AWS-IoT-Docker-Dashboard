# ESP32 MQTT AWS IoT Docker Dashboard

An end-to-end IoT monitoring platform that securely collects real-time environmental data from an ESP32 and DHT22 sensor, publishes it to AWS IoT Core using MQTT over TLS, stores it in MongoDB through a Dockerized Node.js backend, and visualizes the data on a Dockerized React dashboard.

---

# Overview

This project demonstrates a complete cloud-based IoT pipeline using industry-standard technologies. The ESP32 reads temperature and humidity values from a DHT22 sensor and securely publishes them to AWS IoT Core using MQTT over TLS with X.509 certificates. A Dockerized Node.js backend subscribes to the MQTT topic, stores incoming sensor readings in MongoDB, and exposes REST APIs consumed by a Dockerized React dashboard for real-time visualization.

The project serves as a practical demonstration of secure cloud-based IoT communication, containerized deployment, and real-time monitoring.

---

# Demo Screenshots

Replace the placeholders below with your screenshots.

### Dashboard

<img width="1849" height="942" alt="Screenshot from 2026-07-07 18-27-46" src="https://github.com/user-attachments/assets/d3e39fd3-0310-49ea-9848-b29f38172d78" />


### AWS IoT MQTT Test Client

<img width="1848" height="878" alt="Screenshot from 2026-07-07 18-47-09" src="https://github.com/user-attachments/assets/41d517d9-efe9-4a1f-955d-49cd5c0cb099" />


### MongoDB Data

<img width="1848" height="1054" alt="Screenshot from 2026-07-07 18-47-28" src="https://github.com/user-attachments/assets/701a01b4-59b2-4692-bcb4-02c18d362540" />


### Docker Containers

<img width="1848" height="698" alt="Screenshot from 2026-07-07 16-17-00" src="https://github.com/user-attachments/assets/894b5539-88e5-439a-927a-fd8e1d1b9b44" />

<img width="820" height="183" alt="Screenshot from 2026-07-07 17-31-14" src="https://github.com/user-attachments/assets/977bd46c-7593-4eb1-957c-1d524e58521d" />


---

# Features

* Real-time temperature and humidity monitoring
* Secure MQTT communication using TLS
* AWS IoT Core integration
* Dockerized backend, frontend and database
* MongoDB data storage
* REST API using Express.js
* Interactive React dashboard
* Live charts using Chart.js
* Automatic environmental status alerts
* Modular architecture for future extensions

---

# System Architecture

```text
                 +------------------+
                 |    DHT22 Sensor  |
                 +--------+---------+
                          |
                     ESP32 WiFi
                          |
                MQTT over TLS (8883)
                          |
                          v
                  AWS IoT Core Broker
                          |
                  MQTT Subscription
                          |
                          v
               Dockerized Node.js Backend
                          |
                          v
                    MongoDB Database
                          |
                     REST API Server
                          |
                          v
               Dockerized React Dashboard
```

---

# Technology Stack

## Hardware

* ESP32 Development Board
* DHT22 Temperature & Humidity Sensor
* Jumper Wires
* USB Cable

## Cloud

* AWS IoT Core

## Backend

* Node.js
* Express.js
* MQTT.js
* MongoDB
* Mongoose

## Frontend

* React
* Vite
* Axios
* Chart.js

## Containerization

* Docker
* Docker Compose

---

# Project Structure

```text
iot-dashboard/
├── .gitignore
├── docker-compose.yml
├── backend
│   ├── certs
│   │   └── .gitkeep
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── esp32
│   └── esp_code.ino
└── frontend
    ├── public
    │   └── favicon.svg
    ├── src
    │   ├── App.css
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── Dockerfile
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    └── vite.config.js
```

---

# Hardware Connections

| DHT22 | ESP32  |
| ----- | ------ |
| VCC   | 3.3V   |
| GND   | GND    |
| DATA  | GPIO 4 |

> If your DHT22 module is not a breakout board, connect a 10kΩ pull-up resistor between VCC and DATA.

---

# Software Requirements

Install the following:

* Arduino IDE
* ESP32 Board Package
* Docker Desktop (or Docker Engine with Docker Compose)
* Git
* AWS Account

---

# Arduino Libraries

Install using the Arduino Library Manager:

* WiFi
* WiFiClientSecure
* PubSubClient
* DHT Sensor Library
* Adafruit Unified Sensor

---

# AWS IoT Core Setup

## 1. Create a Thing

```
AWS IoT Core
→ Manage
→ All Devices
→ Things
→ Create Thing
```

Example Thing Name:

```
ESP32_DHT22
```

---

## 2. Generate Certificates

Select:

```
Auto-generate certificate
```

Download:

* Device Certificate
* Private Key
* AmazonRootCA1

Attach the generated certificate to your Thing.

---

## 3. Create an IoT Policy

Create a new policy with the following configuration:

**Action**

```
*
```

**Resource ARN**

```
*
```

Create the policy and attach it to the generated certificate.

---

## 4. Obtain the MQTT Endpoint

Navigate to:

```
AWS IoT Core
→ Settings
```

Copy your Device Data Endpoint, for example:

```
xxxxxxxxxxxx-ats.iot.us-east-1.amazonaws.com
```

Replace the placeholder endpoint inside `esp32/esp_code.ino`.

---

# ESP32 Configuration

Update:

```cpp
const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";
const char* mqtt_server = "YOUR_AWS_IOT_ENDPOINT";
```

Replace the placeholders with your own:

* Amazon Root CA
* Device Certificate
* Private Key

Upload the sketch to the ESP32.

---

# Backend Configuration

Place your certificates inside:

```
backend/certs/
```

```
AmazonRootCA1.pem
device-certificate.pem.crt
private.pem.key
```

These files are excluded from Git using `.gitignore`.

---

# Running the Dockerized Application

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/ESP32-MQTT-AWS-IoT-Docker-Dashboard.git
cd ESP32-MQTT-AWS-IoT-Docker-Dashboard
```

Start all services:

```bash
docker compose up --build
```

This launches:

* MongoDB
* Node.js Backend
* React Frontend

Access:

Frontend:

```
http://localhost:5173
```

Backend:

```
http://localhost:5000
```

---

# API Endpoints

**Latest Reading**

```
GET /api/latest
```

**Historical Readings**

```
GET /api/data
```

---

# MQTT Topic

```
sensor/data
```

Example Payload:

```json
{
  "temperature": 29.4,
  "humidity": 68.2
}
```

---

# Troubleshooting

### ESP32 cannot connect

* Verify WiFi credentials.
* Verify the AWS IoT endpoint.
* Ensure certificates are valid.

### Backend not receiving data

* Verify certificates exist in `backend/certs`.
* Ensure the IoT policy is attached correctly.
* Check Docker logs.

### Frontend not updating

Verify:

```
http://localhost:5000/api/latest
```

returns valid JSON.

If necessary:

```bash
docker compose down
docker compose up --build
```

---

# Security Notice

This repository intentionally excludes:

* AWS IoT certificates
* Private keys
* Amazon Root CA files

Generate your own certificates using AWS IoT Core before running the project.

---

# Author

**Sushant Kumar Khobian**

**Xavier Institute of Engineering**

If you found this project useful, consider giving the repository a ⭐.
