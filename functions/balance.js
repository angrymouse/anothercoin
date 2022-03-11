module.exports = async ({ target }, { balances, ticker }) => {
  if (typeof target !== "string") {
    throw new ContractError(`Must specificy target to get balance for`);
  }

  if (typeof balances[target] !== "number") {
    throw new ContractError(`Cannnot get balance, target does not exist`);
  }

  return { result: { target, ticker, balance: balances[target] } };
};
