/**
 * Проверяет, что сумма является конечным положительным числом.
 */
export function isValidAmount(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}
