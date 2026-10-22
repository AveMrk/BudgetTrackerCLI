import "reflect-metadata";

import { LogClass } from "../decorators/LogClass";
import { LogMethod } from "../decorators/LogMethod";
import { ReadOnly } from "../decorators/ReadOnly";
import { Metadata } from "../decorators/Metadata";
import { formatCurrency } from 'formatCurrency';
import {IAccount} from '../interfaces/IAccount'
import {Transaction} from './Transaction'
import {ISummary} from '../interfaces/ISummary'
import {ITransaction} from '../interfaces/ITransaction'
import { writeFile } from "node:fs/promises";
import { escapeCsvValue } from "../utils/escapeCsvValue";
import { v4 as uuidv4 } from "uuid";
import type { AccountUpdate } from "../interfaces/utility-types";

@LogClass
export class Account implements IAccount, ISummary {
  @ReadOnly
  public id: string;
  @Metadata("description", "Массив транзакций счета")
  public transactions: Transaction[] = [];

  constructor(
    public name: string,
  ) {
    this.id = uuidv4();
  }

  update(update: AccountUpdate): void {
    if (update.name !== undefined) {
      this.name = update.name;
    }
  }

  async exportTransactionsToCSV(filename: string): Promise<void> {
    const headers = ["id", "amount", "type", "date", "description"];

    const transactions = this.getTransactions();

    const rows = transactions.map((transaction) => [
      transaction.id,
      transaction.amount,
      transaction.type,
      transaction.date,
      transaction.description,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((value) => escapeCsvValue(value)).join(","),
      ),
    ].join("\n");

    try {
      await writeFile(filename, csv, "utf8");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : String(error);

      throw new Error(
        `Не удалось записать CSV-файл "${filename}": ${message}`,
      );
    }
  }

  get income(): number {
    return this.transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  get expenses(): number {
    return this.transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  get balance(): number {
    return this.income - this.expenses;
  }
  @LogMethod
  addTransaction(transaction: ITransaction): void {
    const item =
      transaction instanceof Transaction
        ? transaction
        : new Transaction(
            transaction.amount,
            transaction.type,
            transaction.date,
            transaction.description,
          );

    this.transactions.push(item);
  }
  @LogMethod
  removeTransactionById(transactionId: string): boolean {
    const index = this.transactions.findIndex(
      (transaction) => transaction.id === transactionId,
    );

    if (index === -1) {
      return false;
    }

    this.transactions.splice(index, 1);
    return true;
  }
  @LogMethod
  getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  getSummary(): ISummary {
    return {
      income: this.income,
      expenses: this.expenses,
      balance: this.balance,
    };
  }

  getSummaryString(): string {
    const transactionsDescription = Reflect.getMetadata(
      "description",
      Object.getPrototypeOf(this),
      "transactions",
    );
    return [
      `Счёт: ${this.name}`,
      `Доходы: ${formatCurrency(this.income)}`,
      `Расходы: ${formatCurrency(this.expenses)}`,
      `Баланс: ${formatCurrency(this.balance)}`,
      `Количество транзакций: ${this.transactions.length}`,
      `Описание свойства transactions: ${transactionsDescription}`,
    ].join("\n");
  }

  toString(): string {
    const transactionList = this.transactions.length
      ? this.transactions
          .map(
            (transaction, index) =>
              `${index + 1}. ${transaction.description} (${
                transaction.type === "income" ? "доход" : "расход"
              } ${formatCurrency(transaction.amount)}) | ${new Date(
                transaction.date,
              ).toLocaleDateString("ru-RU")}`,
          )
          .join("\n")
      : "Транзакций пока нет";

    return `${this.id}. ${this.name}\nСписок транзакций:\n${transactionList}\n\n${this.getSummaryString()}`;
  }
}
