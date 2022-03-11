const fs = require("fs");
const path = require("path");
const Arweave = require("arweave");
const {
  SmartWeaveNodeFactory,
  RedstoneGatewayInteractionsLoader,
} = require("redstone-smartweave");
const jwk = require("./jwk.json");
async function main() {
  const testNet = process.argv.includes("test-net");
  const host = testNet ? "testnet.redstone.tools" : "arweave.net";
  const contractSrc = fs.readFileSync(
    path.join(__dirname, "./contract.js"),
    "utf8"
  );
  const initialState = fs.readFileSync(
    path.join(__dirname, "./init-state.json"),
    "utf8"
  );

  const arweave = Arweave.init({
    host,
    port: 443,
    protocol: "https",
  });
  if(testNet) {
    const wallet = await arweave.wallets.generate();
    const address = await arweave.wallets.jwkToAddress(wallet);
    await arweave.api.get(`/mint/${address}/1000000000000000`);
  }
  const smartweave = SmartWeaveNodeFactory.memCachedBased(arweave)
    .setInteractionsLoader(
      new RedstoneGatewayInteractionsLoader("https://gateway.redstone.finance")
    )
    .build();
  
  console.log("Deployment started");
  
  const contractTxId = await smartweave.createContract.deploy({
    wallet: jwk,
    initState: initialState,
    src: contractSrc,
  });
  
  console.log(`Deployment completed: ${contractTxId}`);
}
(async () => {
  await main();
})();
