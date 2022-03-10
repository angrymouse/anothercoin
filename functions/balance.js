module.exports=async (input,state,action,caller)=>{
    let balances = state.balances;
    let target = input.target;
    let ticker = state.ticker;
    
    if (typeof target !== 'string') {
      throw new ContractError(`Must specificy target to get balance for`);
    }

    if (typeof balances[target] !== 'number') {
      throw new ContractError(`Cannnot get balance, target does not exist`);
    }

    return { result: { target, ticker, balance: balances[target] } };
}