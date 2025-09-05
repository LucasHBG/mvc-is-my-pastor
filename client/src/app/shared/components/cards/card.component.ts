import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CardContent {
  icon?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  variant?: 'default' | 'feature' | 'info' | 'highlight' | 'outline';
  size?: 'small' | 'medium' | 'large';
  clickable?: boolean;
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() content: CardContent = {};
  @Input() variant: CardContent['variant'] = 'default';
  @Input() size: CardContent['size'] = 'medium';
  @Input() clickable: boolean = false;
  @Input() customClass: string = '';

  // Individual inputs for flexibility
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() description: string = '';

  get cardClasses(): string {
    const classes = ['app-card'];
    
    // Add variant class
    if (this.variant) {
      classes.push(`card-${this.variant}`);
    }
    
    // Add size class
    if (this.size) {
      classes.push(`card-${this.size}`);
    }
    
    // Add clickable class
    if (this.clickable) {
      classes.push('card-clickable');
    }
    
    // Add custom class
    if (this.customClass) {
      classes.push(this.customClass);
    }
    
    return classes.join(' ');
  }

  get displayIcon(): string {
    return this.content.icon || this.icon;
  }

  get displayTitle(): string {
    return this.content.title || this.title;
  }

  get displaySubtitle(): string {
    return this.content.subtitle || this.subtitle;
  }

  get displayDescription(): string {
    return this.content.description || this.description;
  }

  get displayVariant(): CardContent['variant'] {
    return this.content.variant || this.variant;
  }

  get displaySize(): CardContent['size'] {
    return this.content.size || this.size;
  }

  get displayClickable(): boolean {
    return this.content.clickable !== undefined ? this.content.clickable : this.clickable;
  }
}
