import { formatCurrency } from "formatCurrency";

function calculateTotal(values: number[]): number {
  let total: number = 0;

  for (const value of values) {
    total += value;
  }

  return total;
}

function calculateAverage(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return calculateTotal(values) / values.length;
}



function getTopValues(values: number[], count: number): number[] {
  return [...values]
    .sort((a: number, b: number): number => b - a)
    .slice(0, Math.max(0, Math.floor(count)));
}

function printSummary(values: number[]): void {
  console.log("Всего записей:", values.length);
  console.log("Сумма:", calculateTotal(values));
  console.log("Среднее:", calculateAverage(values));
}

// Проверка calculateTotal
console.log("Сумма:", calculateTotal([1000, 2000, 3000]));

// Проверка calculateAverage
console.log("Среднее:", calculateAverage([1000, 2000, 3000]));
console.log("Среднее пустого массива:", calculateAverage([]));

// Проверка formatCurrency
console.log("Валюта:", formatCurrency(1000));

// Проверка getTopValues
console.log("Топ-2:", getTopValues([100, 500, 200, 800], 2));

// Проверка printSummary
printSummary([100, 500, 1000, 2000, 800]);
