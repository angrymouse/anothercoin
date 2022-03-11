const fs = require("fs");
const path = require("path");
const Arweave = require("arweave");
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
  console.log("Transfer started...");

  const txId = await smartweave
    .contract(config.wiContract)
    .connect(jwk)
    .writeInteraction({
      function: "transfer",
      qty: BigInt(process.argv[2]).toString(),
      target: process.argv[3],
    });

  console.log(`Transfer completed, transaction ID: ${txId}`);
}
(async () => {
  await main();
})();
