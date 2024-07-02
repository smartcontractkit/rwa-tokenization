# Smart Contracts for RWA Tokenization

## Getting Started
- [Install Foundry and Rust](/docs/INSTALL.md)
- [Foundry Guide](/docs/FOUNDRY.md)
- [OpenAI API Key](https://platform.openai.com/api-keys)

## Overview of Functions
Chainlink functions enables you to leverage the power of a decentralized oracle network (DON) to execute external function calls (off-chain) to inform on-chain interactions.

Chainlink is able to execute a user-defined function via a DON, which comes to consensus on the results and reports the median result to the requesting contract via a callback function.

---

## Functions Workflow

### 0. Install Dependencies
```
yarn
```

### 1. Setup Environment Variables

#### Create Password
Chainlink Functions enables you to securely share secrets with the DON. Secrets are encrypted with a password.
```
yarn signin
```
Once the ecrpytion key is created with your desired password, you can safely share your secrets with the DON, which requires multiple nodes to decrypt with consensus.

#### Store Variables

We may now safely store environment variables without worrying about them being exposed, since they will be encrypted with your desired password. 

These variables will be stored in a file called `.env.enc`.

```
yarn setup
```
After running the command, you'll be prompted to enter the following for each variable to be encrypted:

- **Name**: used to identify the variable.

- **Value**: your (*unencrypted*) environment variable (*secret*).

For this demonstration, you will need to add the following to your encrypted environment variables:
- `PRIVATE_KEY`

### 2. Simulate Functions
Before deploying, it's useful to simulate the execution of your function to ensure the output of your function execution is as expected.

You may simulate your function using the command below.

```
yarn prices
```
AND // OR
```
yarn metadata
```

For full details on creating HTTP requestion via functions, read our [API Reference Documentation](https://docs.chain.link/chainlink-functions/api-reference/javascript-source).

### 3. Deploy Consumer

```
yarn deploy
```

**Note**: ensure you have updated the deployment script to align with your target blockchain configurations.

### 4. Create Subscription
Fund a new Functions billing subscription via the [Chainlink Functions UI](https://functions.chain.link/) and add your deployed Consumer Contract as a an authorized consumer to your subscription OR do so programmatically, as follows: <br />
```
npx hardhat func-sub-create --network <NETWORK_NAME> --amount <LINK_AMOUNT> --contract <CONSUMER_ADDRESS>
```

### 5. Make Requests
Functions enable you to make requests via the consumer contract. Before requesting, make sure you have successfully compiled your Consumer Contract (`RealEstate.sol`), otherwise the request will fail to process.

You may do this programmatically with: <br/>
```
npx hardhat func-request --network <NETWORK_NAME> --contract <CONSUMER_ADDRESS> --subid <SUBSCRIPTION_ID>
```

You will see a confirmation request, so hit `Y` and press enter. 

Once the request is fulfilled the console will show the response (decoded into the relevant return type) from the execution of your custom JS script.

### 6. Make Queries
You are also able to query the response that was stored in your Functions Consumer contract either through the [Functions UI](https://functions.chain.link/) or programmatically as follows: <br/>
```
npx hardhat func-read --contract <CONSUMER_ADDRESS> --network <NETWORK_NAME>
```