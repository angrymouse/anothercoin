const fs = require("fs");
const path = require("path");
const Arweave = require("arweave");
const { SmartWeaveNodeFactory } = require("redstone-smartweave");
const config=require("./config.json")
const jwk = require("./jwk.json");

(async () => {
    // Loading contract source and initial state from files
  
    // Arweave and SmartWeave initialization
    const arweave = Arweave.init({
      host: "arweave.net",
      port: 443,
      protocol: "https",
    });
    
    const smartweave = SmartWeaveNodeFactory.memCached(arweave);
  

  let txId=  await smartweave.contract(config.wiContract).connect(jwk).viewState({
    function: "balance",
    target:process.argv[2]
  })
  console.log(txId)
    console.log("Balance: " + txId.result.balance+" $ANO");
  })();