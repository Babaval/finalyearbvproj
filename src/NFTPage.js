import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function NFTPage() {
  const [nfts, setNfts] = useState([]);
  const [error, setError] = useState(null);
  const apiKey = "1ef9c95fc2d44baa87de0b1a5907106f";

  // Fetch top NFTs from OpenSea API
  const fetchTopNFTs = async () => {
    try {
      const response = await axios.get(
        `https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=10&api_key=${apiKey}`
      );
      if (response.data.assets) {
        setNfts(response.data.assets);
      } else {
        setError("Failed to fetch Top NFTs data.");
      }
    } catch (error) {
      console.error("Error fetching NFT data:", error);
      setError("Failed to fetch Top NFTs data.");
    }
  };

  useEffect(() => {
    fetchTopNFTs();
  }, []);

  return (
    <div className="nft-page">
      <h1>Top NFTs</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="nft-list">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Collection</th>
              <th>Token ID</th>
              <th>Last Sale Price (ETH)</th>
            </tr>
          </thead>
          <tbody>
            {nfts.length > 0 ? (
              nfts.map((nft, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={nft.image_url || "https://via.placeholder.com/100"}
                      alt={nft.name || "NFT Image"}
                      width="50"
                    />
                  </td>
                  <td>{nft.name || "Unnamed NFT"}</td>
                  <td>{nft.collection?.name || "Unknown Collection"}</td>
                  <td>{nft.token_id}</td>
                  <td>
                    {nft.last_sale?.payment_token?.eth_price
                      ? `${nft.last_sale.payment_token.eth_price} ETH`
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No NFTs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NFTPage;
