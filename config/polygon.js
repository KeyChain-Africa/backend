const privateKey = process.env.POLYGON_PRIVATE_KEY;

if (!privateKey || !privateKey.startsWith('0x') || privateKey.length !== 66) {
  throw new Error('POLYGON_PRIVATE_KEY invalide ou mal formatée dans .env');
}

module.exports = {
  rpcUrl: process.env.POLYGON_RPC_URL,
  privateKey,
  contractAddress: process.env.POLYGON_CONTRACT_ADDRESS,
  abi: require('./polygon-abi.json')
};
