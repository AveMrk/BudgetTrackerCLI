
import type { ITransaction } from "./ITransaction";

// Возвращает тип поля, если TField — ключ ITransaction,
// иначе возвращает never.
export type TransactionFieldType<TField> =
  TField extends keyof ITransaction
    ? ITransaction[TField]
    : never;

// Делает выбранные поля опциональными.
export type OptionalTransaction<
  TFields extends keyof ITransaction,
> = Omit<ITransaction, TFields> &
  Partial<Pick<ITransaction, TFields>>;

// Делает выбранные поля readonly.
export type ReadonlyTransactionFields<
  TFields extends keyof ITransaction,
> = Omit<ITransaction, TFields> &
  Readonly<Pick<ITransaction, TFields>>;

// true, если T содержит обязательное поле type,
// значение которого — именно "income".
export type IsIncome<T> =
  T extends { type: "income" } ? true : false;
