import React, { Component } from "react";
import axios from "axios";
import { Card, Grid, Icon, Input, Button, Table } from "semantic-ui-react";
import { QRCodeCanvas } from "qrcode.react";

const apiKey = "FBXGXMYSW5AGYX7P4YZV2HHCRD3439B4HG";
const endpoint = `https://api.etherscan.io/api`;

class OtherPage extends Component {
  constructor() {
    super();
    this.state = {
      ethUSD: "",
      ethBTC: "",
      latestBlock: 0,
      difficulty: "N/A",
      marketCap: 0,
      erc721Transactions: [],
      contractAddress: "",
    };
  }

  handleContractAddressChange = (event) => {
    this.setState({ contractAddress: event.target.value });
  };

  handleFetchData = async () => {
    if (this.state.contractAddress) {
      await this.fetchERC721Data();
    } else {
      alert("Please enter a contract address.");
    }
  };

  async componentDidMount() {
    await this.fetchEthereumData();
  }

  fetchEthereumData = async () => {
    try {
      const { data: pricesData } = await axios.get(
        `${endpoint}?module=stats&action=ethprice&apikey=${apiKey}`
      );
      const ethUSD = pricesData.result.ethusd;
      const ethBTC = pricesData.result.ethbtc;

      const { data: marketCapData } = await axios.get(
        `${endpoint}?module=stats&action=ethsupply&apikey=${apiKey}`
      );
      const marketCap = (parseInt(marketCapData.result.slice(0, -18)) * ethUSD).toFixed(2);

      const { data: latestBlockData } = await axios.get(
        `${endpoint}?module=proxy&action=eth_blockNumber&apikey=${apiKey}`
      );
      const latestBlock = parseInt(latestBlockData.result, 16);

      this.setState({ ethUSD, ethBTC, latestBlock, marketCap });
    } catch (error) {
      console.error("Error fetching Ethereum data: ", error);
    }
  };

  fetchERC721Data = async () => {
    const { contractAddress } = this.state;
    try {
      const erc721TransactionResponse = await axios.get(
        `${endpoint}?module=account&action=tokennfttx&contractaddress=${contractAddress}&startblock=0&endblock=99999999&page=1&offset=25&sort=desc&apikey=${apiKey}`
      );
      let transactions = erc721TransactionResponse.data.result || [];
      
      // Sorting by tokenID in ascending order
      transactions = transactions.sort((a, b) => parseInt(a.tokenID) - parseInt(b.tokenID));
      
      this.setState({ erc721Transactions: transactions });
    } catch (error) {
      console.error("Error fetching ERC-721 data: ", error);
    }
  };

  renderERC721Info = () => {
    const { erc721Transactions } = this.state;

    if (erc721Transactions.length === 0) {
      return <p>No ERC-721 transactions found.</p>;
    }

    return (
      <Card fluid>
        <Card.Content>
          <Card.Header className="erc721-info-title">ERC-721 NFT Information</Card.Header>
          <Card.Description>
            <h4>Ownership History (Sorted by Token ID Ascending):</h4>
            <div className="table-container">
              <Table className="transaction-table" celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>From</Table.HeaderCell>
                    <Table.HeaderCell>To</Table.HeaderCell>
                    <Table.HeaderCell>Token ID</Table.HeaderCell>
                    <Table.HeaderCell>Transaction Hash</Table.HeaderCell>
                    <Table.HeaderCell>ETH Transferred</Table.HeaderCell>
                    <Table.HeaderCell>QR Code</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {erc721Transactions.map((tx, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>
                        {tx.from === "0x0000000000000000000000000000000000000000"
                          ? "Minted"
                          : tx.from}
                      </Table.Cell>
                      <Table.Cell>{tx.to}</Table.Cell>
                      <Table.Cell>{tx.tokenID}</Table.Cell>
                      <Table.Cell>
                        <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">
                          {tx.hash}
                        </a>
                      </Table.Cell>
                      <Table.Cell>
                        {tx.value && tx.value !== "0"
                          ? `${(parseFloat(tx.value) / 1e18).toFixed(5)} ETH`
                          : "0.00 ETH"}
                      </Table.Cell>
                      <Table.Cell>
                        <QRCodeCanvas value={`https://etherscan.io/tx/${tx.hash}`} size={64} />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  };

  render() {
    const { ethUSD, ethBTC, latestBlock, marketCap } = this.state;
    return (
      <div style={{ padding: "20px", backgroundColor: "#161616", color: "#ffffff" }}>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column>
              <div style={{ display: "flex", alignItems: "center", padding: "10px 0" }}>
                <strong style={{ width: "120px" }}>Ether Price:</strong>
                <span>{ethUSD} USD | {ethBTC} BTC</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", padding: "10px 0" }}>
                <strong style={{ width: "120px" }}>Latest Block:</strong>
                <span>{latestBlock}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", padding: "10px 0" }}>
                <strong style={{ width: "120px" }}>Difficulty:</strong>
                <span>N/A</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", padding: "10px 0" }}>
                <strong style={{ width: "120px" }}>Market Cap:</strong>
                <span>{marketCap} USD</span>
              </div>
            </Grid.Column>
            <Grid.Column>
              <Input
                placeholder="Enter Contract Address"
                onChange={this.handleContractAddressChange}
                value={this.state.contractAddress}
                fluid
                style={{ marginBottom: "10px" }}
              />
              <Button onClick={this.handleFetchData} color="blue" fluid>
                Fetch Data
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid style={{ marginTop: "20px" }}>
          <Grid.Row centered>
            <Grid.Column>{this.renderERC721Info()}</Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default OtherPage;
