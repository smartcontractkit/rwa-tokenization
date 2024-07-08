const { Web3 } = require("web3");
const { RPC_URLS } = require("../constants");

const {
  CHAIN_ID,
} = require('../constants');

const clients = {avaxFuji: []};

clients.avaxFuji.push(new Web3(RPC_URLS[0]));
clients.avaxFuji.push(new Web3(RPC_URLS[1]));
clients.avaxFuji.push(new Web3(RPC_URLS[2]));

const avaxFujiRandomClient = () => clients.avaxFuji[~~(clients.avaxFuji.length * Math.random())];

module.exports = {
  get avaxFujiWeb3() {
    return avaxFujiRandomClient();
  },

  web3Factory: chainId => {
    switch (chainId) {
      case CHAIN_ID:
        return avaxFujiRandomClient();
    }
  },
};