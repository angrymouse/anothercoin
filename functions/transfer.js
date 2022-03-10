let wilstonToANO=require("../helpers/wilstonToANO")
module.exports=async (input,state,action,caller)=>{
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