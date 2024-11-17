import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/nfts", (req, res) => {
  const mockNFTData = [
    {
      collection: "OnChainShiba",
      type: "ERC-721",
      volume: 47,
      change: -19.23,
      sales: 2,
      minPrice: 21,
      maxPrice: 26,
    },
    {
      collection: "Azuki",
      type: "ERC-721",
      volume: 23.5243,
      change: -2.75,
      sales: 5,
      minPrice: 0.75,
      maxPrice: 4.735,
    },
  ];

  res.json(mockNFTData);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
