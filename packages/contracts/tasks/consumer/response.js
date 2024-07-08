const { decodeResult } = require("@chainlink/functions-toolkit")
const path = require("path")
const process = require("process")

task(
  "func-response",
  "Reads the latest response (or error) returned to a FunctionsConsumer via tokenid"
)
  .addParam("contract", "Address of the consumer contract to read")
  .addParam("tokenid", "tokenid to read")
  .addOptionalParam(
    "configpath",
    "Path to Functions request config file",
    `${__dirname}/../../priceConfig.js`,
    types.string
  )
  .setAction(async (taskArgs) => {
    console.log(`Reading data from Functions consumer contract ${taskArgs.contract} on network ${network.name}`)
    const consumerContractFactory = await ethers.getContractFactory("RealEstate")
    const consumerContract = await consumerContractFactory.attach(taskArgs.contract)
    const tokenid = parseInt(taskArgs.tokenid)
    const houseInfo = await consumerContract.houseInfo(tokenid)

  // get the result from the on-chain response and display it.
    let latestResponse = Number(houseInfo.listPrice)
    console.log("\nOn-Chain response (listPrice): ", latestResponse.toLocaleString(
      "en-US",
      { style: "currency", currency: "USD" }
    ))
    if (latestResponse.length > 0 && latestResponse !== "0x") {
      const requestConfig = require(path.isAbsolute(taskArgs.configpath)
        ? taskArgs.configpath
        : path.join(process.cwd(), taskArgs.configpath))
      const decodedResult = decodeResult(latestResponse, requestConfig.expectedReturnType).toString()
      console.log(`\nOn-chain response represented as a hex string: ${latestResponse}\n${
        `Decoded as: ${decodedResult}`}`)
    } else if (latestResponse == "0x") {
      console.log("Empty Response: ", latestResponse)
    }
  })
