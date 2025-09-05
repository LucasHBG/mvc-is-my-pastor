import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        console.error('Failed to parse currentUser from localStorage:', error);
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
      }
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const user: User = {
          id: '1',
          name: 'John Doe',
          email: email,
          company: 'Acme Corp'
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        
        observer.next(true);
        observer.complete();
      }, 1000);
    });
  }

  loginWithGoogle(googleUser: any): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const user: User = {
          id: googleUser.sub || '1',
          name: googleUser.name || 'Google User',
          email: googleUser.email || 'user@gmail.com',
          company: 'My Company'
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        
        observer.next(true);
        observer.complete();
      }, 1000);
    });
  }

  signup(userData: any): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const user: User = {
          id: Date.now().toString(),
          name: userData.name || 'New User',
          email: userData.email,
          company: userData.company || 'My Company'
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        
        observer.next(true);
        observer.complete();
      }, 2000);
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
