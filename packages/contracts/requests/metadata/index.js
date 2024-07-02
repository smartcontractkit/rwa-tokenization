const id = args[0];
const infoResponse = await Functions.makeHttpRequest({
    url: `https://api.chateau.voyage/house/${id}`,
});
if (infoResponse.error) {
    throw Error('Housing Info Request Error');
}
const homeAddress = infoResponse.data.homeAddress;
const yearBuilt = infoResponse.data.yearBuilt;

return Functions.encodeString([homeAddress, yearBuilt]);;