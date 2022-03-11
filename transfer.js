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
  
    // Deploying contract
    console.log("Transfer started...");
    
  let txId=  await smartweave.contract(config.wiContract).connect(jwk).writeInteraction({
    function: "transfer",
    qty:(BigInt(process.argv[2])).toString(),
    target:process.argv[3]
  },[],{
    target: process.argv[3],
    quantity: "0"
})

    console.log("Transfer completed, tx ID: " +txId);
  })();