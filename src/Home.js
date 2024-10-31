// Home.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function Home() {
  const [etherPrice, setEtherPrice] = useState("");
  const [marketCap, setMarketCap] = useState("");
  const [totalTransactions, setTotalTransactions] = useState("");
  const [gasPrice, setGasPrice] = useState("");
  const [latestBlocks, setLatestBlocks] = useState([]);
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [lastFinalizedBlock, setLastFinalizedBlock] = useState("");

  useEffect(() => {
    const apiKey = "FBXGXMYSW5AGYX7P4YZV2HHCRD3439B4HG";

    const fetchEtherPrice = async () => {
      try {
        const response = await axios.get(
          `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${apiKey}`
        );
        if (response.data.status === "1") {
          setEtherPrice(response.data.result.ethusd);
        }
      } catch (error) {
        console.error("Error fetching Ether price:", error);
      }
    };

    const fetchMarketCap = async () => {
      try {
        const supplyResponse = await axios.get(
          `https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=${apiKey}`
        );
        if (supplyResponse.data.status === "1") {
          const totalSupply = parseFloat(supplyResponse.data.result) / 1e18;
          setMarketCap((totalSupply * etherPrice).toFixed(2));
        }
      } catch (error) {
        console.error("Error fetching market cap:", error);
      }
    };

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

    const fetchLastFinalizedBlock = async () => {
      try {
        const response = await axios.get(
          `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${apiKey}`
        );
        const blockNumberHex = response.data.result;
        setLastFinalizedBlock(parseInt(blockNumberHex, 16));
      } catch (error) {
        console.error("Error fetching last finalized block:", error);
      }
    };

    const fetchLatestBlocks = async () => {
        try {
          // Fetch the latest block number
          const response = await axios.get(
            `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=FBXGXMYSW5AGYX7P4YZV2HHCRD3439B4HG`
          );
          
          if (response.data.result) {
            const latestBlockNumber = parseInt(response.data.result, 16); // Convert hex to decimal
            const blocks = [];
      
            // Fetch details for the latest 5 blocks
            for (let i = 0; i < 5; i++) {
              const blockNumberHex = "0x" + (latestBlockNumber - i).toString(16); // Convert to hex for API
              const blockResponse = await axios.get(
                `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${blockNumberHex}&boolean=true&apikey=FBXGXMYSW5AGYX7P4YZV2HHCRD3439B4HG`
              );
      
              if (blockResponse.data.result) {
                blocks.push(blockResponse.data.result);
              } else {
                console.warn(`Block data not found for block number ${latestBlockNumber - i}`);
              }
            }
      
            setLatestBlocks(blocks);
          } else {
            console.error("Failed to retrieve the latest block number.");
          }
        } catch (error) {
          console.error("Error fetching latest blocks:", error);
        }
      };
      

    const fetchLatestTransactions = async () => {
      try {
        const response = await axios.get(
          `https://api.etherscan.io/api?module=account&action=txlist&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
        );
        if (response.data.status === "1") {
          setLatestTransactions(response.data.result.slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching latest transactions:", error);
      }
    };

    fetchEtherPrice();
    fetchMarketCap();
    fetchGasPrice();
    fetchLastFinalizedBlock();
    fetchLatestBlocks();
    fetchLatestTransactions();
  }, [etherPrice]); // Depend on etherPrice for market cap calculation

  return (
    <div className="homepage">
      <header className="header">
        <div className="market-info">
          <span>ETH Price: ${etherPrice}</span>
          <span>Gas Price: {gasPrice} Gwei</span>
        </div>
        <h1>The Ethereum Blockchain Explorer</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Address / Txn Hash / Block / Token / Domain Name"
          />
          <button>Search</button>
        </div>
      </header>

      <section className="market-overview">
        <div className="overview-card">
          <h3>ETHER PRICE</h3>
          <p>${etherPrice}</p>
        </div>
        <div className="overview-card">
          <h3>MARKET CAP</h3>
          <p>${marketCap || "N/A"}</p>
        </div>
        <div className="overview-card">
          <h3>LAST FINALIZED BLOCK</h3>
          <p>{lastFinalizedBlock || "N/A"}</p>
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
                  <p>Block Number: {parseInt(block.number, 16) || "N/A"}</p>
                  <p>
                    Time:{" "}
                    {block.timestamp
                      ? new Date(block.timestamp * 1000).toLocaleTimeString()
                      : "N/A"}
                  </p>
                  <p>Miner: {block.miner || "N/A"}</p>
                  <p>
                    Transactions:{" "}
                    {block.transactions ? block.transactions.length : 0}
                  </p>
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
                  <p>
                    Hash:{" "}
                    <a
                      href={`https://etherscan.io/tx/${txn.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {txn.hash}
                    </a>
                  </p>
                  <p>From: {txn.from || "N/A"}</p>
                  <p>To: {txn.to || "N/A"}</p>
                  <p>
                    Value: {txn.value ? (parseFloat(txn.value) / 1e18).toFixed(5) : "0"}{" "}
                    ETH
                  </p>
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
