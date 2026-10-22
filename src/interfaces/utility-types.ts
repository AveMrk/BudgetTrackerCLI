import type { ITransaction } from "./ITransaction";
import type { IAccount } from "./IAccount";
import type { TransactionType } from "./TransactionType";
import type { Transaction } from "../classes/Transaction";
import type { Account } from "../classes/Account";

// Частичное обновление без возможности менять ID
export type TransactionUpdate = Partial<Omit<ITransaction, "id">>;
export type AccountUpdate = Partial<Pick<IAccount, "name">>;

// Обязательные поля
export type CompleteTransaction = Required<ITransaction>;

// Транзакция без описания
export type TransactionWithoutDescription = Omit<
  ITransaction,
  "description"
>;

// Выборка ключевых полей
export type TransactionPreview = Pick<
  ITransaction,
  "id" | "amount" | "type" | "date"
>;

export type AccountInfo = Pick<IAccount, "id" | "name">;

// Лимиты для каждой категории
export type CategoryLimits = Record<TransactionType, number>;

// Типы конструктора и экземпляра
export type TransactionConstructorParams =
  ConstructorParameters<typeof Transaction>;

export type TransactionInstance = InstanceType<typeof Transaction>;

// Описание может быть строкой или null
export type NullableDescription = Omit<ITransaction, "description"> & {
  description: string | null;
};

// Дополнительно: извлечение типов из методов
export type TransactionUpdateParams = Parameters<Transaction["update"]>[0];
export type AccountUpdateParams = Parameters<Account["update"]>[0];