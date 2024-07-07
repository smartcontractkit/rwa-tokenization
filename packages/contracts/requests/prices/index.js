const { ethers } = await import('npm:ethers@6.10.0');
const abiCoder = ethers.AbiCoder.defaultAbiCoder();

const tokenId = args[0];

const apiResponse = await Functions.makeHttpRequest({
    url: `https://api.chateau.voyage/house/${tokenId}`,
});

const listPrice = Number(apiResponse.data.listPrice);

console.log(`List Price: ${listPrice}`);

const encoded = abiCoder.encode([
    `uint256`,
    `uint256`
], [
    tokenId,
    listPrice
]);

return ethers.getBytes(encoded);