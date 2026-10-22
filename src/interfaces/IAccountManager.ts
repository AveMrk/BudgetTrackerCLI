import {IAccount} from './IAccount'
import {ISummary} from './ISummary'

export interface IAccountManager {
  addAccount(account: IAccount): void;
  removeAccountById(accountId: string): boolean;
  getAccountById(id: string): IAccount | undefined;
  getAllAccounts(): IAccount[];
  getSummary(): ISummary;
}
