let wilstonToANO=require("../helpers/wilstonToANO")
module.exports=async (input,state,action,caller)=>{
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