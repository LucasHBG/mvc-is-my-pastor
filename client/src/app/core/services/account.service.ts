import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Account {
  id: string;
  name: string;
  iban: string;
  balance: number;
  currency: string;
  accountType: 'business' | 'personal';
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountsSubject = new BehaviorSubject<Account[]>([]);
  public accounts$ = this.accountsSubject.asObservable();

  constructor() {
    this.loadAccounts();
  }

  private loadAccounts(): void {
    // Mock data - in real app, this would come from API
    const mockAccounts: Account[] = [
      {
        id: '1',
        name: 'Business Current Account',
        iban: 'FR76 1234 1234 1234 1234 1234 123',
        balance: 15430.50,
        currency: 'EUR',
        accountType: 'business',
        isActive: true
      },
      {
        id: '2',
        name: 'Savings Account',
        iban: 'FR76 5678 5678 5678 5678 5678 567',
        balance: 8250.00,
        currency: 'EUR',
        accountType: 'business',
        isActive: true
      }
    ];

    this.accountsSubject.next(mockAccounts);
  }

  getAccounts(): Observable<Account[]> {
    return this.accounts$;
  }

  getAccountById(id: string): Observable<Account | undefined> {
    return new Observable(observer => {
      const accounts = this.accountsSubject.value;
      const account = accounts.find(acc => acc.id === id);
      observer.next(account);
      observer.complete();
    });
  }

  getTotalBalance(): Observable<number> {
    return new Observable(observer => {
      const accounts = this.accountsSubject.value;
      const total = accounts.reduce((sum, account) => sum + account.balance, 0);
      observer.next(total);
      observer.complete();
    });
  }

  updateAccountBalance(accountId: string, newBalance: number): Observable<boolean> {
    return new Observable(observer => {
      const accounts = this.accountsSubject.value;
      const accountIndex = accounts.findIndex(acc => acc.id === accountId);
      
      if (accountIndex !== -1) {
        accounts[accountIndex].balance = newBalance;
        this.accountsSubject.next([...accounts]);
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }
}
