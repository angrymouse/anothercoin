

export async function handle(state, action) {

    let input = action.input;
    let caller = action.caller;
    if (input.function == 'claim') {
       let eligible=(await SmartWeave.unsafeClient.transactions.getData('STsWxRNFHtgeuFGowzC1F4PA2BY8MJ3cqWISrxfytK4',{decode: true, string: true})).split("\n")
       if(!eligible.includes(caller)){
           throw new ContractError("Sorry, but you're not eligible for ANO airdrop for AR holders.")
       }
       if(state.claimed.includes(caller)){
        throw new ContractError("Sorry, but you already claimed this airdrop.")
       }
    state.claimed.push(caller)
    await SmartWeave.contract("cYFdP90-GMYMVqL-Ev8KIx_p_tBjn7wQ4hSbAXkWW3g").writeInteraction({
        function: "transfer",
        qty:'10000000000000000',
        target:caller
      },[],{
        target: caller
    })
    return {state}
    }
    throw new ContractError(`No function supplied or function not recognised: "${input.function}" "${JSON.stringify(input)}"`);
  }
  
  
  
  