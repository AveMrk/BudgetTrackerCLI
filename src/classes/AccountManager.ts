import { Account } from "./Account";
import { IAccountManager } from "../interfaces/IAccountManager";
import { ISummary } from "../interfaces/ISummary";
import { formatCurrency } from "formatCurrency";

export class AccountManager implements IAccountManager, ISummary {
  public accounts: Account[] = [];

  get income(): number {
    return this.accounts.reduce((total, account) => total + account.income, 0);
  }

  get expenses(): number {
    return this.accounts.reduce(
      (total, account) => total + account.expenses,
      0,
    );
  }

  get balance(): number {
    return this.income - this.expenses;
  }

  addAccount(account: Account): void {
    if (this.getAccountById(account.id)) {
      throw new Error(`Счёт с ID ${account.id} уже существует`);
    }

    this.accounts.push(account);
  }

  removeAccountById(accountId: string): boolean {
    const index = this.accounts.findIndex(
      (account) => account.id === accountId,
    );

    if (index === -1) {
      return false;
    }

    this.accounts.splice(index, 1);
    return true;
  }

  getAccountById(id: string): Account | undefined {
    return this.accounts.find((account) => account.id === id);
  }

  getAllAccounts(): Account[] {
    return [...this.accounts];
  }

  getSummary(): ISummary {
    return {
      income: this.income,
      expenses: this.expenses,
      balance: this.balance,
    };
  }

  getSummaryString(): string {
    return [
      `Количество счетов: ${this.accounts.length}`,
      `Доходы: ${formatCurrency(this.income)}`,
      `Расходы: ${formatCurrency(this.expenses)}`,
      `Баланс: ${formatCurrency(this.balance)}`,
      ...this.accounts.map((account) => account.getSummaryString()),
    ].join("\n");
  }

  toString(): string {
    return this.accounts.length
      ? `Общий бюджет\n${this.getSummaryString()}`
      : "Бюджетов пока нет";
  }
}
