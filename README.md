# Disclaimer
This tutorial represents an educational example to use a Chainlink system, product, or service and is provided to demonstrate how to interact with Chainlink’s systems, products, and services to integrate them into your own. This template is provided “AS IS” and “AS AVAILABLE” without warranties of any kind, it has not been audited, and it may be missing key checks or error handling to make the usage of the system, product or service more clear. Do not use the code in this example in a production environment without completing your own audits and application of best practices. Neither Chainlink Labs, the Chainlink Foundation, nor Chainlink node operators are responsible for unintended outputs that are generated due to errors in code.

# Real World Asset (RWA) Tokenization
> Asset tokenization using Chainlink Functions on Avalanche.

----

# Getting Started

## Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
- [foundry](https://getfoundry.sh/)
  - You'll know you did it right if you can run `forge --version` and you see a response like `forge 0.2.0 (816e00b 2023-03-16T00:05:26.396218Z)`
- [node](https://nodejs.org/en/download/)
  - You'll know you did it right if you can run `node --version` and you see a response like `v16.13.0`
- [yarn](https://classic.yarnpkg.com/en/docs/install)
  - You'll know you did it right if you can run `yarn --v` and you see a response like `1.22.22`
- [deno](https://docs.deno.com/runtime/manual/getting_started/installation)
  - You'll know you did it right if you can run `deno --version` and you see a response like `deno 1.40.5 (release, x86_64-apple-darwin) v8 12.1.285.27 typescript 5.3.3`

## Installation (Scripts)
The scripts below are contained in the root level of this repository and they enable you to cover a lot of ground without having to navigate to each directory independently. 

Please ensure you understand the logic progression of each installation step prior to executing these scripts, so you can explore how everything works together. 

I use whiteboards when digesting new topics. It helps me visualization the process, but do whatever works for you and try out new things because you are capable of SO much more than you may even imagine...

  ```
    yarn prepare
  ```
  Installs all app dependences, then prompts you to input a password, which will be used to encrypt your [`contracts`](/apps/contracts/README.md) environment variables.
  
  ```
    yarn setup
  ``` 
  Sets your environment variables for the contracts app. In our case, we only need `PRIVATE_KEY` to begin.
  
  ```
    yarn build
  ```
  Carries out the [Makefile](/apps/contracts/Makefile), compiles contracts, then builds the frontend.
  

 ```
    yarn deploy
 ```
 Deploys [`RealEstate.sol`](/apps/contracts/src/RealEstate.sol) to Fuji testnet. 
 > **Important**: make sure to update the deployment script prior to deploying. If you do not already have a subscription, please make sure to run the `yarn sub:create` script before deployment.

 After deployment please take note of the contract address and update throughout all 3 apps using search and replace, as explained [here](/apps/contracts/README.md).
 
 If you made changes to the smart contract, be sure to also update the ABI everywhere it is found in the apps. You abi may be found here in your ignored [`out` directory](/apps/contracts/out/RealEstate.sol/RealEstate.json). 
 
 When I open the JSON, I format it with a JSON extension in VS Code. Next, I copy the ABI, which is contained in brackets at the start of the JSON.

 ```
   yarn assign
 ```
 Depending on whether you are interesting in (or in need of) creating a new subscription (`subId`), then you will either run the create script to creates, otherwise you will assign your recently deployment RealEstate.sol contract to the `--subid` you specify.
 
 Be sure to update the `--subid <SUB_ID>` task argument, otherwise `assign` will fail, subscriptions your `PRIVATE_KEY` does not own.
  
  ```
    yarn serve
  ```
  Starts the backend api server instance.
  
  ```
    yarn show
  ```
  Launches dev mode of the frontend for local hosting and debugging prior to deployment.
  
  ```
    yarn request
  ```
  
  Submits a priceUpdate request transaction on the RealEstate asset tied to the `--tokenid` passed into the task arg. Prior to submitting the request transaction, you will be provided with an estimated cost (in **LINK**) along with the option to proceed or cancel the transaction.

  ```
    yarn response
  ```
  Shows the response from updating the price associated with the `--tokenid` passed into the task arg.

## Directories (`Apps`)
There are 3 distinct apps: server, contracts, frontend.

- [Server](/apps/server/README.md) hosts the API, which is used for demonstration purposes for this tutorial. In a production environment, you will use an API that hosts real data as it pertains to the asset you desire to tokenize. This is only for demonstration purposes and not designed to be used in production.

- [Contracts](/apps/contracts/README.md) stores the smart contract and the tasks for executing the key functionality for a tokenized Real Estate asset that is connected to Chainlink's Functions.

- [Frontend](/apps/frontend/README.md) stores the code that hosts the UI we use for demonstration purposes. This is useful for comparing the on-chain data with the off-chain data. In a production environment, you will need to use a frontend that aligns with your use cases. This is simply for the purposes of demonstrating in an educational environment and not designed to help with the issuance or maintanence of a tokenized asset.


---

# Useful Resources

- [Chainlink Blog: RWA Explained](https://blog.chain.link/real-world-assets-rwas-explained/)

- [Education Hub: Tokenized Real Estate](https://chain.link/education-hub/tokenized-real-estate)

- [Bridge Interactive Data](https://bridgedataoutput.com/docs/explorer/reso-web-api#oShowProperty)

- [How to: Tokenize an Asset](https://chain.link/education-hub/how-to-tokenize-an-asset)

- [What is Tokenized Real Estate?](https://chain.link/education-hub/tokenized-real-estate)

- [Cyfrin: What Are Tokenized Assets?](https://www.cyfrin.io/blog/what-are-tokenized-assets-crypto-rwas-explained)

- [Tokenized Real World Assets](https://blog.chain.link/tokenized-real-world-assets)
