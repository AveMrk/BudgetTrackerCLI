
import inquirer from "inquirer";

import { Account } from "./Account";
import { AccountManager } from "./AccountManager";
import { Transaction } from "./Transaction";
import type { TransactionType } from "../interfaces/TransactionType";

export class ApplicationController {
  public accountManager: AccountManager;

  constructor() {
    this.accountManager = new AccountManager();
  }

  async start(): Promise<void> {
    let running = true;

    while (running) {
      console.clear();
      console.log(this.accountManager.getSummaryString());

      const accounts = this.accountManager.getAllAccounts();

      const choices = [
        ...accounts.map((account) => ({
          name: `${account.name} — баланс: ${account.balance.toFixed(2)} ₽`,
          value: account.id,
        })),
        new inquirer.Separator(),
        { name: "➕ Создать счёт", value: "create" },
        { name: "🚪 Выход", value: "exit" },
      ];

      const { action } = await inquirer.prompt([
        {
          type: "select",
          name: "action",
          message: "Выберите счёт или действие:",
          choices,
        },
      ]);

      if (action === "exit") {
        running = false;
      } else if (action === "create") {
        await this.createAccount();
      } else {
        await this.watchAccount(action);
      }
    }

    console.log("До встречи!");
  }

  async createAccount(): Promise<void> {
    const { name } = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Введите название счёта:",
        validate: (value: string) =>
          value.trim().length > 0 || "Название не должно быть пустым",
      },
    ]);

    const account = new Account(name.trim());
    this.accountManager.addAccount(account);

    console.log(`Счёт «${account.name}» успешно создан.`);
    await this.pause();
  }

  async watchAccount(accountId: string): Promise<void> {
    let back = false;

    while (!back) {
      const account = this.accountManager.getAccountById(accountId);

      if (!account) {
        console.log("Счёт не найден.");
        await this.pause();
        return;
      }

      console.clear();
      console.log(account.getSummaryString());
      console.log("\nТранзакции:");

      const transactions = account.getTransactions();

      if (transactions.length === 0) {
        console.log("Транзакций пока нет.");
      } else {
        transactions.forEach((transaction, index) => {
          console.log(`${index + 1}. ${transaction.toString()}`);
        });
      }

      const { action } = await inquirer.prompt([
        {
          type: "select",
          name: "action",
          message: "Действия со счётом:",
          choices: [
            { name: "➕ Добавить транзакцию", value: "add" },
            { name: "➖ Удалить транзакцию", value: "removeTransaction" },
            { name: "📄 Экспортировать в CSV", value: "export" },
            { name: "🗑 Удалить счёт", value: "removeAccount" },
            { name: "⬅ Назад к счетам", value: "back" },
          ],
        },
      ]);

      switch (action) {
        case "add":
          await this.addTransaction(accountId);
          break;

        case "removeTransaction":
          await this.removeTransaction(accountId);
          break;

        case "export":
          await this.exportTransactionsToCSV(accountId);
          break;

        case "removeAccount": {
          const deleted = await this.removeAccount(accountId);
          if (deleted) {
            back = true;
          }
          break;
        }

        case "back":
          back = true;
          break;
      }
    }
  }

  async addTransaction(accountId: string): Promise<void> {
    const account = this.accountManager.getAccountById(accountId);

    if (!account) {
      console.log("Счёт не найден.");
      await this.pause();
      return;
    }

    const { amount } = await inquirer.prompt([
      {
        type: "input",
        name: "amount",
        message: "Введите сумму:",
        validate: (value: string) => {
          const parsed = Number(value.replace(",", "."));

          return (
            (Number.isFinite(parsed) && parsed > 0) ||
            "Введите число больше нуля"
          );
        },
      },
    ]);

    const { type } = await inquirer.prompt([
      {
        type: "select",
        name: "type",
        message: "Тип транзакции:",
        choices: [
          { name: "Доход", value: "income" },
          { name: "Расход", value: "expense" },
        ],
      },
    ]);

    const today = new Date().toISOString().slice(0, 10);

    const { date } = await inquirer.prompt([
      {
        type: "input",
        name: "date",
        message: "Дата (YYYY-MM-DD):",
        default: today,
        validate: (value: string) =>
          /^\d{4}-\d{2}-\d{2}$/.test(value) &&
          !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) &&
          new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value
            ? true
            : "Введите корректную дату в формате YYYY-MM-DD",
      },
    ]);

    const { description } = await inquirer.prompt([
      {
        type: "input",
        name: "description",
        message: "Описание транзакции:",
        validate: (value: string) =>
          value.trim().length > 0 || "Описание не должно быть пустым",
      },
    ]);

    const transaction = new Transaction(
      Number(amount.replace(",", ".")),
      type as TransactionType,
      date,
      description.trim(),
    );

    account.addTransaction(transaction);

    console.log("Транзакция успешно добавлена.");
    await this.pause();
  }

  async removeTransaction(accountId: string): Promise<void> {
    const account = this.accountManager.getAccountById(accountId);

    if (!account) {
      console.log("Счёт не найден.");
      await this.pause();
      return;
    }

    const transactions = account.getTransactions();

    if (transactions.length === 0) {
      console.log("Нет транзакций для удаления.");
      await this.pause();
      return;
    }

    const { transactionId } = await inquirer.prompt([
      {
        type: "select",
        name: "transactionId",
        message: "Выберите транзакцию для удаления:",
        choices: transactions.map((transaction) => ({
          name: transaction.toString(),
          value: transaction.id,
        })),
      },
    ]);

    const { confirmed } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmed",
        message: "Вы уверены, что хотите удалить транзакцию?",
        default: false,
      },
    ]);

    if (!confirmed) {
      console.log("Удаление отменено.");
      await this.pause();
      return;
    }

    const removed = account.removeTransactionById(transactionId);

    console.log(
      removed
        ? "Транзакция удалена."
        : "Не удалось найти транзакцию для удаления.",
    );

    await this.pause();
  }

  async removeAccount(accountId: string): Promise<boolean> {
    const account = this.accountManager.getAccountById(accountId);

    if (!account) {
      console.log("Счёт не найден.");
      await this.pause();
      return false;
    }

    const { confirmed } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmed",
        message: `Удалить счёт «${account.name}» и все его транзакции?`,
        default: false,
      },
    ]);

    if (!confirmed) {
      console.log("Удаление отменено.");
      await this.pause();
      return false;
    }

    const removed = this.accountManager.removeAccountById(accountId);

    console.log(removed ? "Счёт удалён." : "Не удалось удалить счёт.");
    await this.pause();

    return removed;
  }

  async exportTransactionsToCSV(accountId: string): Promise<void> {
    const account = this.accountManager.getAccountById(accountId);

    if (!account) {
      console.log("Счёт не найден.");
      await this.pause();
      return;
    }

    const { filename } = await inquirer.prompt([
      {
        type: "input",
        name: "filename",
        message: "Имя CSV-файла без расширения:",
        default: account.name.replace(/[<>:"/\\|?*]/g, "_"),
        validate: (value: string) =>
          value.trim().length > 0 || "Введите имя файла",
      },
    ]);

    const safeName = filename.trim().replace(/\.csv$/i, "");
    const path = `${safeName}.csv`;

    try {
      await account.exportTransactionsToCSV(path);
      console.log(`Транзакции экспортированы в файл "${path}".`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : String(error);

      console.error(`Ошибка экспорта: ${message}`);
    }

    await this.pause();
  }

  private async pause(): Promise<void> {
    await inquirer.prompt([
      {
        type: "input",
        name: "continue",
        message: "Нажмите Enter, чтобы продолжить",
      },
    ]);
  }
}
