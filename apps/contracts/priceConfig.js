const fs = require("fs")
const { Location, ReturnType, CodeLanguage } = require("@chainlink/functions-toolkit")

// loads: environment variables from .env.enc file (if exists)
require("@chainlink/env-enc").config()

// configures request: via settings in the fields below
const priceConfig = {

    // source code location
    codeLocation: Location.Inline,
    
    // code language (JavaScript only)
    codeLanguage: CodeLanguage.JavaScript,

    // source code to be executed
    source: fs.readFileSync("priceRequest.js").toString(),

    // (optional) accessed within the source code with `secrets.varName` (ie: secrets.apiKey), must be a string.
    secrets: { 
        // apiKey: process.env.API_KEY
    },

    // args (array[""]): source code accesses via `args[index]`.
    args: ["0"],
        
    // shows: expected type of the returned value.
    expectedReturnType: ReturnType.uint256,
  
    // Per-node secrets objects assigned to each DON member. When using per-node secrets, nodes can only use secrets which they have been assigned.
    perNodeSecrets: [],

    // ETH wallet key used to sign secrets so they cannot be accessed by a 3rd party
    walletPrivateKey: process.env["PRIVATE_KEY"],
    
    // Redundant URLs which point to encrypted off-chain secrets
    secretsURLs: [],
}

module.exports = priceConfig