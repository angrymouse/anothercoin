

export async function handle(state, action) {

  let input = action.input;
  let caller = action.caller;
  if (input.function == 'transfer') {
    return await (require("./functions/transfer"))(input, state, action, caller)
  } else if (input.function == 'balance') {
    return await (require("./functions/balance"))(input, state, action, caller)
  } else if (input.function == "bunchTransfers") {
    return await (require("./functions/bunchTransfers"))(input, state, action, caller)
  }else if(input.function=="evolveSync"){
    state.evolve=(await SmartWeave.contracts.readContractState(state.governanceContract)).settings.find(setting=>setting[0]=="anoevolve")[1]
    return {state}
  }
  throw new ContractError(`No function supplied or function not recognised: "${input.function}" "${JSON.stringify(input)}"`);
}



