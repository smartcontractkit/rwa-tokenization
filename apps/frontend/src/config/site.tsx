export const siteConfig = {
  title: 'RWA Tokenization | Chainlink',
  description: 'Chainlink Functions example for tokenizing real-world assets',
  links: {
    github: 'https://github.com/SmartContractKit/rwa-tokenization',
    docs: 'https://dev.chain.link/products/functions',
    functionsDocs:
      'https://docs.chain.link/chainlink-functions/getting-started',
    testnetFaucet:
    'https://faucets.chain.link/fuji',
      // 'https://core.app/en/tools/testnet-faucet/?subnet=c&token=c',
  },
  paths: {
    search: '/',
    architecture: '/architecture',
    components: '/components',
    design: '/design',
  },
  image: 'https://chateau.voyage/opengraph-image.png',
  ogImage: 'https://chateau.voyage/opengraph-image.png',
  twitterImage: 'https://chateau.voyage/opengraph-image.png',
}

export type SiteConfig = typeof siteConfig
