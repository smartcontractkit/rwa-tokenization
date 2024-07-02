const BN = require("bn.js")
const REAL_ESTATE_ABI = require('./abis/RealEstate.json');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3002'
const CHAIN_ID = 43113 // 0xa869

const RPC_URLS = [
  'https://api.avax-test.network/ext/bc/C/rpc', 
  'https://rpc.ankr.com/avalanche_fuji',
  'https://ava-testnet.public.blastapi.io/ext/bc/C/rpc'
]

const _1E18 = new BN("1000000000000000000");
const REAL_ESTATE_ADDRESS = "0x89DccebCB4715937487f472a482217883e64D5E0"

module.exports = {
  API_BASE_URL, RPC_URLS, CHAIN_ID, _1E18, BN,
  REAL_ESTATE_ADDRESS, REAL_ESTATE_ABI
};
