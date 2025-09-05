import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Card, CardService } from '../../core/services/card.service';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent implements OnInit {
  cards$: Observable<Card[]>;
  personalCards$: Observable<Card[]>;
  companyCards$: Observable<Card[]>;
  selectedFilter: 'all' | 'personal' | 'company' | 'active' | 'blocked' = 'all';
  selectedCardType: 'all' | 'personal' | 'company' = 'all';

  constructor(private cardService: CardService) {
    this.cards$ = this.cardService.cards$;
    this.personalCards$ = this.cardService.getPersonalCards();
    this.companyCards$ = this.cardService.getCompanyCards();
  }

  ngOnInit(): void {}

  filterCards(filter: 'all' | 'personal' | 'company' | 'active' | 'blocked'): void {
    this.selectedFilter = filter;
    
    switch (filter) {
      case 'all':
        this.cards$ = this.cardService.cards$;
        break;
      case 'personal':
        this.cards$ = this.cardService.getPersonalCards();
        break;
      case 'company':
        this.cards$ = this.cardService.getCompanyCards();
        break;
      case 'active':
        this.cards$ = this.cardService.getCardsByStatus('active');
        break;
      case 'blocked':
        this.cards$ = this.cardService.getCardsByStatus('blocked');
        break;
    }
  }

  blockCard(cardId: string): void {
    this.cardService.blockCard(cardId).subscribe(success => {
      if (success) {
        console.log('Card blocked successfully');
        // Refresh the current filter
        this.filterCards(this.selectedFilter);
      }
    });
  }

  unblockCard(cardId: string): void {
    this.cardService.unblockCard(cardId).subscribe(success => {
      if (success) {
        console.log('Card unblocked successfully');
        // Refresh the current filter
        this.filterCards(this.selectedFilter);
      }
    });
  }

  formatCurrency(amount: number): string {
    return this.cardService.formatCurrency(amount);
  }

  getStatusClass(status: Card['status']): string {
    return this.cardService.getStatusClass(status);
  }

  getBrandClass(brand: Card['brand']): string {
    return this.cardService.getBrandClass(brand);
  }

  formatCardNumber(cardNumber: string): string {
    return this.cardService.formatCardNumber(cardNumber);
  }

  formatExpiryDate(expiryDate: string): string {
    return expiryDate;
  }

  getCardTypeIcon(cardType: 'personal' | 'company'): string {
    return cardType === 'personal' ? '👤' : '🏢';
  }

  getCardBrandIcon(brand: 'visa' | 'mastercard' | 'amex'): string {
    switch (brand) {
      case 'visa':
        return 'VISA';
      case 'mastercard':
        return 'MC';
      case 'amex':
        return 'AMEX';
      default:
        return 'CARD';
    }
  }

  getLastUsedText(lastUsed?: Date): string {
    if (!lastUsed) return 'Never used';
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastUsed.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  }
}
