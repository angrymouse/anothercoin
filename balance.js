const { SmartWeaveNodeFactory } = require("redstone-smartweave");
const config = require("./config.json");
const jwk = require("./jwk.json");
async function main() {
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });

  const smartweave = SmartWeaveNodeFactory.memCached(arweave);

  const txId = await smartweave
    .contract(config.wiContract)
    .connect(jwk)
    .viewState({
      function: "balance",
      target: process.argv[2],
    });
  console.log(`Transaction id: ${txId}`);
  console.log(`Balance: ${txId.result.balance} $ANO`);
}
(async () => {
  await main();
})();
