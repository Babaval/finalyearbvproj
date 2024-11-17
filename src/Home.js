import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";
import { FaEthereum } from "react-icons/fa";

function Home() {
  const [etherPrice, setEtherPrice] = useState("N/A");
  const [marketCap, setMarketCap] = useState("N/A");
  const [gasPrice, setGasPrice] = useState("N/A");
  const [latestBlocks, setLatestBlocks] = useState([]);
  const [latestTransactions, setLatestTransactions] = useState([]);

  const apiKey = "FBXGXMYSW5AGYX7P4YZV2HHCRD3439B4HG";

  // Fetch Ether Price
  const fetchEtherPrice = async () => {
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${apiKey}`
      );
      if (response.data.status === "1") {
        setEtherPrice(parseFloat(response.data.result.ethusd).toFixed(2));
      }
    } catch (error) {
      console.error("Error fetching Ether price:", error);
    }
  };

  // Fetch Market Cap
  const fetchMarketCap = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=${apiKey}`
      );
      if (response.data.status === "1" && etherPrice !== "N/A") {
        const totalSupply = parseFloat(response.data.result) / 1e18;
        setMarketCap((totalSupply * etherPrice).toFixed(2));
      }
    } catch (error) {
      console.error("Error fetching market cap:", error);
    }
  }, [etherPrice]);

  // Fetch Gas Price
  const fetchGasPrice = async () => {
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${apiKey}`
      );
      if (response.data.status === "1") {
        setGasPrice(response.data.result.ProposeGasPrice);
      }
    } catch (error) {
      console.error("Error fetching gas price:", error);
    }
  };

  // Fetch Latest Blocks
  const fetchLatestBlocks = async () => {
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${apiKey}`
      );
      const latestBlockNumber = parseInt(response.data.result, 16);

      const blocks = [];
      for (let i = 0; i < 5; i++) {
        const blockNumberHex = "0x" + (latestBlockNumber - i).toString(16);
        const blockResponse = await axios.get(
          `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${blockNumberHex}&boolean=true&apikey=${apiKey}`
        );

        if (blockResponse.data.result) {
          blocks.push({
            number: parseInt(blockResponse.data.result.number, 16),
            timestamp: blockResponse.data.result.timestamp
              ? new Date(parseInt(blockResponse.data.result.timestamp, 16) * 1000).toLocaleString()
              : "N/A",
            miner: blockResponse.data.result.miner || "N/A",
            transactions: blockResponse.data.result.transactions
              ? blockResponse.data.result.transactions.length
              : 0,
          });
        }
      }
      setLatestBlocks(blocks);
    } catch (error) {
      console.error("Error fetching latest blocks:", error);
    }
  };

  // Fetch Latest Transactions
  const fetchLatestTransactions = async () => {
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=txlistinternal&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
      );
      if (response.data.status === "1") {
        setLatestTransactions(response.data.result.slice(0, 10));
      }
    } catch (error) {
      console.error("Error fetching latest transactions:", error);
    }
  };

  useEffect(() => {
    fetchEtherPrice();
    fetchGasPrice();
    fetchLatestTransactions();
  }, []);

  useEffect(() => {
    fetchMarketCap();
  }, [fetchMarketCap]);

  useEffect(() => {
    fetchLatestBlocks();
  }, []);

  return (
    <div className="homepage">
      <header className="header">
        <div className="header-left">
          <img src="/logo.png" alt="Logo" className="logo-image" />
          <h1 className="etherscan-title">Etherscan</h1>
        </div>

        <div className="market-info">
          <div className="price-info">
            <FaEthereum className="eth-icon" />
            <span>ETH Price: <span className="price-text">${etherPrice}</span></span>
          </div>
          <div className="price-info">
            <span>Gas Price: <span className="gas-text">{gasPrice} Gwei</span></span>
          </div>
        </div>

        <h2 className="center-title">The Ethereum Blockchain Explorer</h2>
      </header>

      <section className="market-overview">
        <div className="overview-card">
          <h3>ETHER PRICE</h3>
          <p>${etherPrice}</p>
        </div>
        <div className="overview-card">
          <h3>MARKET CAP</h3>
          <p>${marketCap !== "N/A" ? marketCap : "Calculating..."}</p>
        </div>
        <div className="overview-card">
          <h3>MED GAS PRICE</h3>
          <p>{gasPrice} Gwei</p>
        </div>
      </section>

      <div className="latest-section">
        <div className="latest-blocks">
          <h4>Latest Blocks</h4>
          <ul>
            {latestBlocks.length > 0 ? (
              latestBlocks.map((block, index) => (
                <li key={index}>
                  <p>Block Number: {block.number}</p>
                  <p>Time: {block.timestamp}</p>
                  <p>Miner: {block.miner}</p>
                  <p>Transactions: {block.transactions}</p>
                </li>
              ))
            ) : (
              <p>No latest blocks available.</p>
            )}
          </ul>
        </div>

        <div className="latest-transactions">
          <h4>Latest Transactions</h4>
          <ul>
            {latestTransactions.length > 0 ? (
              latestTransactions.map((txn, index) => (
                <li key={index}>
                  <p>Hash: {txn.hash}</p>
                  <p>From: {txn.from || "N/A"}</p>
                  <p>To: {txn.to || "N/A"}</p>
                  <p>Value: {txn.value ? (parseFloat(txn.value) / 1e18).toFixed(5) : "0"} ETH</p>
                </li>
              ))
            ) : (
              <p>No latest transactions available.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
