(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // helpers/wilstonToANO.js
  var require_wilstonToANO = __commonJS({
    "helpers/wilstonToANO.js"(exports, module) {
      module.exports = function wilstonToANO(wilston) {
        wilston = wilston.toString();
        let finalWilston = new Array(12).fill("0");
        wilston = wilston.split("").reverse();
        wilston.forEach((wi, wii) => {
          finalWilston[wii] = wi;
        });
        finalWilston = finalWilston.reverse();
        finalWilston[finalWilston.length - 12] = "." + finalWilston[finalWilston.length - 12];
        finalWilston = "0" + finalWilston.join("");
        return parseFloat(finalWilston);
      };
    }
  });

  // functions/transfer.js
  var require_transfer = __commonJS({
    "functions/transfer.js"(exports, module) {
      var wilstonToANO = require_wilstonToANO();
      module.exports = async (input, state, action, caller) => {
        let target = input.target;
        if (!input.qty) {
          throw new ContractError(`Invalid value for "qty". Must be an amount of Wilston (integer string)`);
        }
        let qty = BigInt(input.qty);
        if (!state.balances[caller]) {
          throw new ContractError("You don't have any ANO! Buy or receive some to make operations.");
        }
        state.balances[caller] = BigInt(state.balances[caller]);
        if (!qty) {
          throw new ContractError(`Invalid value for "qty". Must be an amount of Wilston (integer string)`);
        }
        if (!target) {
          throw new ContractError(`No target specified`);
        }
        if (qty <= 0n || caller == target) {
          throw new ContractError("Invalid token transfer");
        }
        if (state.balances[caller] < qty) {
          throw new ContractError(`Caller balance not high enough to send ${wilstonToANO(qty)} ANO!`);
        }
        if (!state.balances[target]) {
          state.balances[target] = 0n;
        } else {
          state.balances[target] = BigInt(state.balances[target]);
        }
        state.balances[caller] -= qty;
        state.balances[target] += qty;
        state.balances[caller] = state.balances[caller].toString();
        state.balances[target] = state.balances[target].toString();
        return { state };
      };
    }
  });

  // functions/balance.js
  var require_balance = __commonJS({
    "functions/balance.js"(exports, module) {
      var wilstonToANO = require_wilstonToANO();
      module.exports = async (input, state, action, caller) => {
        let balances = state.balances;
        let target = input.target;
        let ticker = state.ticker;
        if (typeof target !== "string") {
          throw new ContractError(`Must specificy target to get balance for`);
        }
        if (typeof balances[target] !== "number") {
          throw new ContractError(`Cannnot get balance, target does not exist`);
        }
        return { result: { target, ticker, balance: wilstonToANO(balances[target]) } };
      };
    }
  });

  // functions/bunchTransfers.js
  var require_bunchTransfers = __commonJS({
    "functions/bunchTransfers.js"(exports, module) {
      var wilstonToANO = require_wilstonToANO();
      module.exports = async (input, state, action, caller) => {
        if (!input.transfers && !Array.isArray(input.transfers)) {
          throw new ContractError(`"transfers" must be array of transfer objects (qty in winston, target as AR address)`);
        }
        if (!state.balances[caller]) {
          throw new ContractError("You don't have any ANO! Buy or receive some to make operations.");
        }
        state.balances[caller] = BigInt(state.balances[caller]);
        input.transfers.forEach((transfer) => {
          if (!transfer.qty) {
            throw new ContractError(`Invalid value for "qty". Must be an amount of Wilston (integer string)`);
          }
          transfer.qty = BigInt(input.qty);
          let qty = transfer.qty;
          if (!transfer || !transfer.qty || !transfer.target || transfer.qty <= 0n) {
            throw new ContractError(`"transfers" must be an array of transfer objects (qty in winston, target as AR address). Transfers field contains invalid transfer`);
          }
          let target = transfer.target;
          if (state.balances[caller] < transfer.qty) {
            throw new ContractError(`Caller balance is not high enough to complete all transfers! Operation cancelled`);
          }
          if (!state.balances[transfer.target]) {
            state.balances[transfer.target] = 0n;
          } else {
            state.balances[transfer.target] = BigInt(state.balances[transfer.target]);
          }
          state.balances[caller] -= qty;
          state.balances[transfer.target] += qty;
          state.balances[transfer.target] = state.balances[transfer.target].toString();
        });
        state.balances[caller] = state.balances[caller].toString();
        return { state };
      };
    }
  });

  // contract-src.js
  async function handle(state, action) {
    let input = action.input;
    let caller = action.caller;
    if (input.function == "transfer") {
      return await require_transfer()(input, state, action, caller);
    } else if (input.function == "balance") {
      return await require_balance()(input, state, action, caller);
    } else if (input.function == "bunchTransfers") {
      return await require_bunchTransfers()(input, state, action, caller);
    } else if (input.function == "evolveSync") {
      state.evolve = await SmartWeave.contracts.readContractState(state.governanceContract).settings.find((setting) => setting[0] == "anoevolve");
      return { state };
    }
    throw new ContractError(`No function supplied or function not recognised: "${input.function}" "${JSON.stringify(input)}"`);
  }
})();
