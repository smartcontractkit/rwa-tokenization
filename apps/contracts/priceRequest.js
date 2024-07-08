const tokenId = args[0];

const apiResponse = await Functions.makeHttpRequest({
    url: `https://api.chateau.voyage/house/${tokenId}`,
});

const listPrice = Number(apiResponse.data.listPrice);

console.log(`List Price: ${listPrice}`);

return listPrice;