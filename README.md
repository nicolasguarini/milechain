# MileChain

A decentralized application built on Ethereum blockchain using Hardhat, Solidity, Next.js, IPFS, and Fleek. MileChain aims to provide a tamper-proof and decentralized solution for recording the history of mileage and ownership of vehicles to prevent fraud in the used-car market. Our solution utilizes the immutability of blockchain, the decentralized storage of IPFS, and the secure hosting of Fleek to ensure data integrity and reliability.

## Usage

### Pre Requisites

Before running any command, make sure to install dependencies:

```sh
npm install
```

### Setup environment variabltes

You'll want to set your `GOERLI_RPC_URL` and `PRIVATE_KEY` as environment variables. You can add them to a `.env` file, similar to what you see in `.env.example`.

- `PRIVATE_KEY`: The private key of your account (like from metamask). NOTE: FOR DEVELOPMENT, PLEASE USE A KEY THAT DOESN'T HAVE ANY REAL FUNDS ASSOCIATED WITH IT.
- `GOERLI_RPC_URL`: This is url of the node you're working with. You can get setup with one for free from Alchemy

### Compile

Compile the smart contracts with Hardhat:

```sh
npx hardhat compile
```

### Test

Run the tests:

```sh
npx hardhat test
```

### Test gas costs

To get a report of gas costs, set env `REPORT_GAS` to true. A file named `gas-report.txt` will be generated.

To get a USD estimation of gas cost, you'll need a `COINMARKETCAP_API_KEY` environment variable. You can get one for free from CoinMarketCap.

### Deploy contract to network

```
npx hardhat deploy --network goerli | mainnet | localhost
```

### Validate a contract with etherscan (requires API key)

If you deploy to a testnet or mainnet, you can verify it if you get an API Key from Etherscan and set it as an environemnt variable named `ETHERSCAN_API_KEY`. You can pop it into your .env file as seen in the .env.example.

In it's current state, if you have your api key set, it will auto verify goerli contracts!

However, you can manual verify with:

```
npx hardhat verify --constructor-args arguments.js DEPLOYED_CONTRACT_ADDRESS
```

## Contributors

Nicolas Guarini - [@nicolasguarini](https://github.com/nicolasguarini) - [nicolasguarini.it](https://nicolasguarini.it) \
Lorenzo Ficazzola - [@Zeref-zt](https://github.com/Zeref-zt)

## License

[GNU GENERAL PUBLIC LICENSE](https://github.com/nicolasguarini/milechain/blob/main/LICENSE)
