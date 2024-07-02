// All supported networks and related contract addresses are defined here.
//
// LINK token addresses: https://docs.chain.link/resources/link-token-contracts/
// Price feeds addresses: https://docs.chain.link/data-feeds/price-feeds/addresses
// Chain IDs: https://chainlist.org/?testnets=true

// Loads environment variables from .env.enc file (if it exists)
require("@chainlink/env-enc").config()

const DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS = 2

const npmCommand = process.env.npm_lifecycle_event
const isTestEnvironment = npmCommand == "test" || npmCommand == "test:unit"

// Set EVM private keys (required)
const PRIVATE_KEY = process.env.PRIVATE_KEY

// TODO @dev - set this to run the accept.js task.
const SECOND_PRIVATE_KEY = process.env.SECOND_PRIVATE_KEY

if (!isTestEnvironment && !PRIVATE_KEY) {
    throw Error("Set the PRIVATE_KEY environment variable with your EVM wallet private key")
}

const accounts = []
if (PRIVATE_KEY) {
    accounts.push(PRIVATE_KEY)
}
if (SECOND_PRIVATE_KEY) {
    accounts.push(SECOND_PRIVATE_KEY)
}

// console.log(`Using accounts: ${accounts}`)

const networks = {
    avalanche: {
        url: "https://api.avax.network/ext/bc/C/rpc",
        gasPrice: undefined,
        nonce: undefined,
        accounts,
        verifyApiKey: "verifyContract",
        chainId: 43114,
        confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
        nativeCurrencySymbol: "AVAX",
        linkToken: "0x5947BB275c521040051D82396192181b413227A3",
        linkPriceFeed: "0x1b8a25F73c9420dD507406C3A3816A276b62f56a", // LINK/AVAX
        functionsRouter: "0x9f82a6A0758517FD0AfA463820F586999AF314a0",
        donId: "fun-avalanche-mainnet-1",
        gatewayUrls: ["https://01.functions-gateway.chain.link/", "https://02.functions-gateway.chain.link/"],
    },
    avalancheFuji: {
        // url: "https://api.avax-test.network/ext/bc/C/rpc",
        url: 'https://ava-testnet.public.blastapi.io/ext/bc/C/rpc',
        // url: 'https://rpc.ankr.com/avalanche_fuji',
        gasPrice: undefined,
        nonce: undefined,
        accounts,
        verifyApiKey: "verifyContract",
        chainId: 43113,
        confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
        nativeCurrencySymbol: "AVAX",
        linkToken: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
        linkPriceFeed: "0x79c91fd4F8b3DaBEe17d286EB11cEE4D83521775", // LINK/AVAX
        functionsRouter: "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0",
        donId: "fun-avalanche-fuji-1",
        gatewayUrls: [
            "https://01.functions-gateway.testnet.chain.link/",
            "https://02.functions-gateway.testnet.chain.link/",
        ],
    },
    // localFunctionsTestnet is updated dynamically by scripts/startLocal.js so it should not be modified here
    localFunctionsTestnet: {
            url: "http://localhost:8545/",
            accounts,
            confirmations: 1,
            nativeCurrencySymbol: "ETH",
            verifyApiKey: "UNSET",
            linkToken: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
            functionsRouter: "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
            donId: "local-functions-testnet",
          },
}

module.exports = {
    networks,
}