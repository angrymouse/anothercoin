export async function handle(state, action) {
  const { input, caller } = action;
  switch (input.function) {
    case "transfer":
      return await require("./functions/transfer")(
        input,
        state,
        action,
        caller
      );
    case "balance":
      return await require("./functions/balance")(
        input,
        state,
        action,
        caller
      );
    case "bunchTransfers":
      return await require("./functions/bunchTransfers")(
        input,
        state,
        action,
        caller
      );
    default:
      throw new ContractError(
        `No function supplied or function not recognised: "${
          input.function
        }" "${JSON.stringify(input)}"`
      );
  }
}
