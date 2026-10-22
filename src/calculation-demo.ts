
const income: number = 190_000;
const expenses: number = 60_000;
const savings: number = 100_000;

const netIncome: number = income - expenses;
const remaining: number = netIncome - savings;

console.log("Income:", income);
console.log("Expenses:", expenses);
console.log("Savings:", savings);
console.log("Net income:", netIncome);
console.log("Remaining:", remaining);
