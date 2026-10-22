
import { Account } from "./classes/Account";
import { AccountManager } from "./classes/AccountManager";
import { ApplicationController } from "./classes/ApplicationController";
import { Transaction } from "./classes/Transaction";

function setInitialState(controller: ApplicationController): void {
  const personalAccount = new Account("Личный бюджет");

  personalAccount.addTransaction(
    new Transaction(1000, "income", "2023-01-01", "Зарплата"),
  );
  personalAccount.addTransaction(
    new Transaction(200, "expense", "2023-01-05", "Продукты"),
  );
  personalAccount.addTransaction(
    new Transaction(150, "expense", "2023-01-09", "Коммунальные услуги"),
  );

  controller.accountManager.addAccount(personalAccount);

  const vacationAccount = new Account("Копилка на отпуск");

  vacationAccount.addTransaction(
    new Transaction(500, "income", "2023-04-01", "Премия"),
  );
  vacationAccount.addTransaction(
    new Transaction(600, "income", "2023-01-01", "Возврат долга"),
  );
  vacationAccount.addTransaction(
    new Transaction(300, "expense", "2023-01-05", "Билеты на самолёт"),
  );
  vacationAccount.addTransaction(
    new Transaction(200, "expense", "2023-01-09", "Номер в отеле"),
  );

  controller.accountManager.addAccount(vacationAccount);
}

const controller = new ApplicationController();

setInitialState(controller);

controller.start().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : String(error);

  console.error("Ошибка приложения:", message);
  process.exitCode = 1;
});
