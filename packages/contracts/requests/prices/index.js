const { ethers } = await import('npm:ethers@6.10.0');
const abiCoder = ethers.AbiCoder.defaultAbiCoder();

const tokenId = args[0];

const apiResponse = await Functions.makeHttpRequest({
    url: `https://api.chateau.voyage/house/${tokenId}`,
});

const listPrice = Number(apiResponse.data.listPrice);
const originalPrice = Number(apiResponse.data.originalPrice);
const taxValue = Number(apiResponse.data.taxValue);

console.log(`List Price: ${listPrice}`);
console.log(`Original List Price: ${originalPrice}`);
console.log(`Tax Assessed Value: ${taxValue}`);

const encoded = abiCoder.encode([
    `uint256`, 
    `uint256`, 
    `uint256`, 
    `uint256`
], [
    tokenId, 
    listPrice, 
    originalPrice, 
    taxValue
]);

return ethers.getBytes(encoded);