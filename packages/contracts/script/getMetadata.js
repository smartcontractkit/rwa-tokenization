const process = require("process")
const path = require("path")
// const fs = require("fs")
const { simulateScript, decodeResult } = require("@chainlink/functions-toolkit")
require("@chainlink/env-enc").config();

const sendRequest = async () => {
    // @dev Update this to point to your desired request config file.
    const requestConfigPath = path.join(process.cwd(), "requests/metadata/config.js") 
    console.log(`Using Functions request config file ${requestConfigPath}\n`)
    const requestConfig = require(requestConfigPath);

    // simulate: JavaScript execution locally.
    const { responseBytesHexstring, errorString, capturedTerminalOutput } = await simulateScript(requestConfig)
    console.log(`${capturedTerminalOutput}\n`)
    if (responseBytesHexstring) {
        console.log(
            `Response returned by script during local simulation: ${decodeResult(
                responseBytesHexstring,
                requestConfig.expectedReturnType
            ).toString()}\n`
        )
    }
    if (errorString) {
        console.log(`Error returned by simulated script:\n${errorString}\n`)
    }
};

sendRequest().catch((err) => {
    console.log("\nError running source simulator: ", err);
});