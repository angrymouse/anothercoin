let wilstonToANO=require("../helpers/wilstonToANO")
module.exports=async (input,state,action,caller)=>{
  let target = input.target;
  if (!input.qty) {
    throw new ContractError(`Invalid value for "qty". Must be an amount of Wilston (integer string)`);
  }
  let qty = BigInt(input.qty);
  if(!state.balances[caller]){
      throw new ContractError("You don't have any ANO! Buy or receive some to make operations.")
  }
  state.balances[caller]=BigInt(state.balances[caller])
  
  if (!qty) {
    throw new ContractError(`Invalid value for "qty". Must be an amount of Wilston (integer string)`);
  }
  
  if (!target) {
    throw new ContractError(`No target specified`);
  }

  if (qty <= 0n || caller == target) {
    throw new ContractError('Invalid token transfer');
  }

  if (state.balances[caller] < qty) {
    throw new ContractError(`Caller balance not high enough to send ${wilstonToANO(qty)} ANO!`);
  }

 
  if(!state.balances[target]){
    state.balances[target]=0n
  }else{
    state.balances[target]=BigInt(state.balances[target])
  }
  state.balances[caller]-=qty
  state.balances[target]+=qty
  state.balances[caller]= state.balances[caller].toString()
  state.balances[target]= state.balances[target].toString()
  return { state };
}