const fs = require("fs");
const path = require("path");
const Arweave = require("arweave");
const { SmartWeaveNodeFactory ,RedstoneGatewayInteractionsLoader} = require("redstone-smartweave");
const jwk = require("./jwk.json");

(async () => {
  // Loading contract source and initial state from files
  const contractSrc = fs.readFileSync(path.join(__dirname, "./contract.js"), "utf8");
  const initialState = fs.readFileSync(path.join(__dirname, "./init-state.json"), "utf8");

  // Arweave and SmartWeave initialization
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });
    
  const smartweave = SmartWeaveNodeFactory.memCachedBased(arweave).setInteractionsLoader(new RedstoneGatewayInteractionsLoader("https://gateway.redstone.finance"))
  .build();;

  // Deploying contract
  console.log("Deployment started");
  const contractTxId = await smartweave.createContract.deploy({
    wallet: jwk,
    initState: initialState,
    src: contractSrc
  });
  console.log("Deployment completed: " + contractTxId);
})();