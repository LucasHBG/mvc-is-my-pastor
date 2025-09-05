import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Transaction {
  id: string;
  accountId: string;
  description: string;
  amount: number;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  category: string;
  reference?: string;
  counterparty?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$ = this.transactionsSubject.asObservable();

  constructor() {
    this.loadTransactions();
  }

  private loadTransactions(): void {
    // Mock data - in real app, this would come from API
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        accountId: '1',
        description: 'Monthly Subscription',
        amount: -49.99,
        date: new Date('2025-09-04'),
        status: 'completed',
        category: 'Software',
        counterparty: 'SaaS Provider'
      },
      {
        id: '2',
        accountId: '1',
        description: 'Client Payment Received',
        amount: 2500.00,
        date: new Date('2025-09-03'),
        status: 'completed',
        category: 'Income',
        counterparty: 'ABC Corp'
      },
      {
        id: '3',
        accountId: '1',
        description: 'Office Rent',
        amount: -1200.00,
        date: new Date('2025-09-01'),
        status: 'completed',
        category: 'Office',
        counterparty: 'Property Management'
      },
      {
        id: '4',
        accountId: '1',
        description: 'Software Subscription',
        amount: -99.00,
        date: new Date('2025-08-30'),
        status: 'pending',
        category: 'Software',
        counterparty: 'Tool Provider'
      },
      {
        id: '5',
        accountId: '2',
        description: 'Interest Payment',
        amount: 12.50,
        date: new Date('2025-09-01'),
        status: 'completed',
        category: 'Interest',
        counterparty: 'Bank'
      }
    ];

    this.transactionsSubject.next(mockTransactions);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactions$;
  }

  getTransactionsByAccount(accountId: string): Observable<Transaction[]> {
    return new Observable(observer => {
      const allTransactions = this.transactionsSubject.value;
      const accountTransactions = allTransactions.filter(t => t.accountId === accountId);
      observer.next(accountTransactions);
      observer.complete();
    });
  }

  getRecentTransactions(limit: number = 5): Observable<Transaction[]> {
    return new Observable(observer => {
      const allTransactions = this.transactionsSubject.value;
      const sortedTransactions = allTransactions
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, limit);
      observer.next(sortedTransactions);
      observer.complete();
    });
  }

  getTransactionsByStatus(status: Transaction['status']): Observable<Transaction[]> {
    return new Observable(observer => {
      const allTransactions = this.transactionsSubject.value;
      const filteredTransactions = allTransactions.filter(t => t.status === status);
      observer.next(filteredTransactions);
      observer.complete();
    });
  }

  getTransactionsByCategory(category: string): Observable<Transaction[]> {
    return new Observable(observer => {
      const allTransactions = this.transactionsSubject.value;
      const filteredTransactions = allTransactions.filter(t => t.category === category);
      observer.next(filteredTransactions);
      observer.complete();
    });
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    return new Observable(observer => {
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString()
      };
      
      const currentTransactions = this.transactionsSubject.value;
      this.transactionsSubject.next([newTransaction, ...currentTransactions]);
      
      observer.next(newTransaction);
      observer.complete();
    });
  }

  updateTransactionStatus(transactionId: string, status: Transaction['status']): Observable<boolean> {
    return new Observable(observer => {
      const transactions = this.transactionsSubject.value;
      const transactionIndex = transactions.findIndex(t => t.id === transactionId);
      
      if (transactionIndex !== -1) {
        transactions[transactionIndex].status = status;
        this.transactionsSubject.next([...transactions]);
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }
}
