import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Dashboard.css";

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [ethPrices, setEthPrices] = useState([]);
  const [latestBlocks, setLatestBlocks] = useState([]);
  const [authData, setAuthData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Ethereum Price Data for the Last 30 Days
  const fetchEthPrices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30&interval=daily"
      );
      const prices = response.data.prices.map((price) => ({
        date: new Date(price[0]).toLocaleDateString(),
        value: price[1],
      }));
      setEthPrices(prices);
    } catch (error) {
      setError("Error fetching Ethereum historical prices.");
      console.error("Error fetching Ethereum historical prices:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Latest Block Transactions
  const fetchLatestBlocks = async () => {
    setLoading(true);
    try {
      const API_KEY = "FBXGXMYSW5AGYX7P4YZV2HHCRD3439B4HG";
      const response = await axios.get(
        `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${API_KEY}`
      );
      const latestBlockNumber = parseInt(response.data.result, 16).toString(16);

      const blockResponse = await axios.get(
        `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=0x${latestBlockNumber}&boolean=true&apikey=${API_KEY}`
      );
      const blockData = blockResponse.data.result;
      const transactionCount = blockData.transactions.length;

      setLatestBlocks([{ blockNumber: latestBlockNumber, transactionCount }]);
    } catch (error) {
      setError("Error fetching latest block transactions.");
      console.error("Error fetching block transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate Mock Authentication Data
  const generateAuthData = () => {
    const mockData = Array.from({ length: 10 }, (_, i) => ({
      label: `Attempt ${i + 1}`,
      successRate: Math.floor(Math.random() * 100),
    }));
    setAuthData(mockData);
  };

  useEffect(() => {
    fetchEthPrices();
    fetchLatestBlocks();
    generateAuthData();
  }, []);

  // Line Chart for Ethereum Price Changes
  const ethPriceData = {
    labels: ethPrices.map((data) => data.date),
    datasets: [
      {
        label: "Ethereum Price (USD) - Last 30 Days",
        data: ethPrices.map((data) => data.value),
        borderColor: "#00ff99",
        backgroundColor: "#006600",
        fill: false,
        tension: 0.4, // Add tension for spike-like appearance
      },
    ],
  };

  // Bar Chart for Latest Block Transactions
  const latestBlocksChart = {
    labels: latestBlocks.map((block) => `Block ${block.blockNumber}`),
    datasets: [
      {
        label: "Transactions per Block",
        data: latestBlocks.map((block) => block.transactionCount),
        backgroundColor: "#36a2eb",
      },
    ],
  };

  // Bar Chart for Authentication Success Rate
  const authDataChart = {
    labels: authData.map((data) => data.label),
    datasets: [
      {
        label: "Authentication Success Rate (%)",
        data: authData.map((data) => data.successRate),
        backgroundColor: "#ff6600",
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {/* Loading Indicator */}
      {loading && <p>Loading...</p>}

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Ethereum Price Tracking */}
      <h2>Ethereum Price Tracking - Last 30 Days</h2>
      <Line data={ethPriceData} />

      {/* Latest Block Transactions */}
      <h2>Latest Block Transactions</h2>
      <Bar data={latestBlocksChart} />

      {/* Authentication Success Rate */}
      <h2>Authentication Success Rate</h2>
      <Bar data={authDataChart} />
    </div>
  );
};

export default Dashboard;
