
export async function handle(state, action) {
  
    let balances = state.balances;
    
    let input = action.input;
    let caller = action.caller;
    if (input.function == 'transfer') {
  
      let target = input.target;
      if (!input.qty) {
        throw new ContractError(`Invalid value for "qty". Must be an amount of Wilston (integer string)`);
      }
      let qty = BigInt(input.qty);
      if(!state.wilstonBalances[caller]){
          throw new ContractError("You don't have any ANO! Buy or receive some to make operations.")
      }
      state.wilstonBalances[caller]=BigInt(state.wilstonBalances[caller])
      
      if (!qty) {
        throw new ContractError(`Invalid value for "qty". Must be an amount of Wilston (integer string)`);
      }
      
      if (!target) {
        throw new ContractError(`No target specified`);
      }
  
      if (qty <= 0n || caller == target) {
        throw new ContractError('Invalid token transfer');
      }
  
      if (state.wilstonBalances[caller] < qty) {
        throw new ContractError(`Caller balance not high enough to send ${wilstonToANO(qty)} ANO!`);
      }
  
     
      if(!state.wilstonBalances[target]){
        state.wilstonBalances[target]=0n
      }else{
        state.wilstonBalances[target]=BigInt(state.wilstonBalances[target])
      }
      state.wilstonBalances[caller]-=qty
      state.wilstonBalances[target]+=qty
      state.balances[target]=wilstonToANO(state.wilstonBalances[target])
      state.balances[caller]=wilstonToANO(state.wilstonBalances[caller])
      state.wilstonBalances[caller]= state.wilstonBalances[caller].toString()
      state.wilstonBalances[target]= state.wilstonBalances[target].toString()
      return { state };
    }
  
    else if (input.function == 'balance') {
  
      let target = input.target;
      let ticker = state.ticker;
      
      if (typeof target !== 'string') {
        throw new ContractError(`Must specificy target to get balance for`);
      }
  
      if (typeof balances[target] !== 'number') {
        throw new ContractError(`Cannnot get balance, target does not exist`);
      }
  
      return { result: { target, ticker, balance: balances[target] } };
    } else if(input.function=="bunchTransfers"){
        if(!input.transfers&&!Array.isArray(input.transfers)){
            throw new ContractError(`"transfers" must be array of transfer objects (qty in winston, target as AR address)`)
        }
        if(!state.wilstonBalances[caller]){
            throw new ContractError("You don't have any ANO! Buy or receive some to make operations.")
        }
        state.wilstonBalances[caller]=BigInt(state.wilstonBalances[caller])
        input.transfers.forEach(transfer=>{
            if (!transfer.qty) {
                throw new ContractError(`Invalid value for "qty". Must be an amount of Wilston (integer string)`);
              }
              transfer.qty = BigInt(input.qty);
              let qty=transfer.qty
              
            if(!transfer||!transfer.qty||!transfer.target||transfer.qty<=0n){
                throw new ContractError(`"transfers" must be an array of transfer objects (qty in winston, target as AR address). Transfers field contains invalid transfer`)
            }
            let target=transfer.target
            if (state.wilstonBalances[caller] < transfer.qty) {
                throw new ContractError(`Caller balance is not high enough to complete all transfers! Operation cancelled`);
              }
              if(!state.wilstonBalances[transfer.target]){
                state.wilstonBalances[transfer.target]=0n
              }else{
                state.wilstonBalances[transfer.target]=BigInt(state.wilstonBalances[transfer.target])
              }
              state.wilstonBalances[caller]-=qty
              state.wilstonBalances[transfer.target]+=qty
              state.balances[transfer.target]=wilstonToANO(state.wilstonBalances[transfer.target])
              state.wilstonBalances[transfer.target]= state.wilstonBalances[transfer.target].toString()
        })
        state.balances[caller]=wilstonToANO(state.wilstonBalances[caller])
        state.wilstonBalances[caller]= state.wilstonBalances[caller].toString()
        return {state}
    }

  
    throw new ContractError(`No function supplied or function not recognised: "${input.function}" "${JSON.stringify(input)}"`);
    
  }


  
function wilstonToANO(wilston){
    wilston=wilston.toString()
    let targetIndex=wilston.length-12
    return parseFloat([...wilston.split("").slice(0,targetIndex),".",...wilston.split("").slice(targetIndex)].join(""))
    
}