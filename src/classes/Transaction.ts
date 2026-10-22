import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import type { TransactionUpdate } from "../interfaces/utility-types";
import type { ITransaction } from "../interfaces/ITransaction";
import type { TransactionType } from "../interfaces/TransactionType";
import { formatCurrency } from "formatCurrency";

moment.locale("ru");

export class Transaction implements ITransaction {
  public readonly id: string;

  constructor(
    public amount: number,
    public type: TransactionType,
    public date: string,
    public description: string,
  ) {
    this.id = uuidv4();
  }

  update(update: TransactionUpdate): void {
    if (update.amount !== undefined) {
      this.amount = update.amount;
    }

    if (update.type !== undefined) {
      this.type = update.type;
    }

    if (update.date !== undefined) {
      this.date = update.date;
    }

    if (update.description !== undefined) {
      this.description = update.description;
    }
  }
  toString(): string {
    const label = this.type === "income" ? "ДОХОД" : "РАСХОД";
    const formattedDate = moment(new Date(this.date)).format("LL");

    return `Транзакция #${this.id}: [${label}] ${formatCurrency(this.amount)}, ${formattedDate}, ${this.description}`;
  }
}