import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./App.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

function App() {
  const [data, setData] = useState([]);
  const [latest, setLatest] = useState(null);

  const fetchData = async () => {
    try {
      const dataRes = await axios.get("http://localhost:5000/api/data");
      const latestRes = await axios.get("http://localhost:5000/api/latest");

      setData(dataRes.data);
      setLatest(latestRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  
  const options = {
    scales: {
      x: {
        ticks: {
          autoSkip: false
        }
      }
    }
  };
  
  const chartData = {
    labels: data.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Temperature (°C)",
        data: data.map((d) => d.temperature),
        borderColor: "red",
        tension: 0.3
      },
      {
        label: "Humidity (%)",
        data: data.map((d) => d.humidity),
        borderColor: "blue",
        tension: 0.3
      }
    ]
  };

  return (
    <div className="container">
      <h1>IoT DHT22 Dashboard</h1>

      {latest && (
        <div className="cards">
          <div className="card">
            <h3>Temperature</h3>
            <p>{latest.temperature} °C</p>
          </div>

          <div className="card">
            <h3>Humidity</h3>
            <p>{latest.humidity} %</p>
          </div>

          <div className={`card ${latest.alert !== "NORMAL" ? "alert" : ""}`}>
            <h3>Status</h3>
            <p>{latest.alert}</p>
          </div>
        </div>
      )}

      <div className="chart-box">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default App;