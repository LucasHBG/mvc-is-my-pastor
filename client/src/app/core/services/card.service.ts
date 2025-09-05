import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Card {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cardType: 'personal' | 'company';
  brand: 'visa' | 'mastercard' | 'amex';
  status: 'active' | 'blocked' | 'expired' | 'pending';
  balance?: number;
  limit: number;
  lastUsed?: Date;
  isVirtual: boolean;
  description?: string;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private cardsSubject = new BehaviorSubject<Card[]>([]);
  public cards$ = this.cardsSubject.asObservable();

  constructor() {
    this.loadCards();
  }

  private loadCards(): void {
    // Mock data - in real app, this would come from API
    const mockCards: Card[] = [
      {
        id: '1',
        cardNumber: '**** **** **** 1234',
        cardHolder: 'John Doe',
        expiryDate: '12/26',
        cardType: 'personal',
        brand: 'visa',
        status: 'active',
        balance: 2850.00,
        limit: 5000.00,
        lastUsed: new Date('2024-12-01'),
        isVirtual: false,
        description: 'Personal Visa Card',
        color: '#1a73e8'
      },
      {
        id: '2',
        cardNumber: '**** **** **** 5678',
        cardHolder: 'John Doe',
        expiryDate: '08/27',
        cardType: 'company',
        brand: 'mastercard',
        status: 'active',
        balance: 15420.50,
        limit: 25000.00,
        lastUsed: new Date('2024-12-02'),
        isVirtual: false,
        description: 'Company Mastercard',
        color: '#eb4034'
      },
      {
        id: '3',
        cardNumber: '**** **** **** 9012',
        cardHolder: 'John Doe',
        expiryDate: '03/25',
        cardType: 'personal',
        brand: 'amex',
        status: 'blocked',
        balance: 0.00,
        limit: 10000.00,
        lastUsed: new Date('2024-11-15'),
        isVirtual: false,
        description: 'Personal American Express',
        color: '#00853d'
      },
      {
        id: '4',
        cardNumber: '**** **** **** 3456',
        cardHolder: 'John Doe',
        expiryDate: '06/26',
        cardType: 'company',
        brand: 'visa',
        status: 'active',
        balance: 8750.25,
        limit: 15000.00,
        lastUsed: new Date('2024-12-03'),
        isVirtual: true,
        description: 'Virtual Company Card',
        color: '#673ab7'
      },
      {
        id: '5',
        cardNumber: '**** **** **** 7890',
        cardHolder: 'John Doe',
        expiryDate: '01/25',
        cardType: 'personal',
        brand: 'visa',
        status: 'expired',
        balance: 0.00,
        limit: 3000.00,
        lastUsed: new Date('2024-10-20'),
        isVirtual: false,
        description: 'Expired Personal Card',
        color: '#9e9e9e'
      }
    ];

    this.cardsSubject.next(mockCards);
  }

  getCards(): Observable<Card[]> {
    return this.cards$;
  }

  getPersonalCards(): Observable<Card[]> {
    return new Observable(observer => {
      const allCards = this.cardsSubject.value;
      const personalCards = allCards.filter(card => card.cardType === 'personal');
      observer.next(personalCards);
      observer.complete();
    });
  }

  getCompanyCards(): Observable<Card[]> {
    return new Observable(observer => {
      const allCards = this.cardsSubject.value;
      const companyCards = allCards.filter(card => card.cardType === 'company');
      observer.next(companyCards);
      observer.complete();
    });
  }

  getCardsByStatus(status: Card['status']): Observable<Card[]> {
    return new Observable(observer => {
      const allCards = this.cardsSubject.value;
      const filteredCards = allCards.filter(card => card.status === status);
      observer.next(filteredCards);
      observer.complete();
    });
  }

  getActiveCards(): Observable<Card[]> {
    return this.getCardsByStatus('active');
  }

  blockCard(cardId: string): Observable<boolean> {
    return new Observable(observer => {
      const cards = this.cardsSubject.value;
      const cardIndex = cards.findIndex(card => card.id === cardId);
      
      if (cardIndex !== -1) {
        cards[cardIndex].status = 'blocked';
        this.cardsSubject.next([...cards]);
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  unblockCard(cardId: string): Observable<boolean> {
    return new Observable(observer => {
      const cards = this.cardsSubject.value;
      const cardIndex = cards.findIndex(card => card.id === cardId);
      
      if (cardIndex !== -1) {
        cards[cardIndex].status = 'active';
        this.cardsSubject.next([...cards]);
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  formatCardNumber(cardNumber: string): string {
    return cardNumber;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getStatusClass(status: Card['status']): string {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'blocked':
        return 'status-blocked';
      case 'expired':
        return 'status-expired';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-unknown';
    }
  }

  getBrandClass(brand: Card['brand']): string {
    switch (brand) {
      case 'visa':
        return 'brand-visa';
      case 'mastercard':
        return 'brand-mastercard';
      case 'amex':
        return 'brand-amex';
      default:
        return 'brand-unknown';
    }
  }
}
