import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';

export interface AuthResponseData {
  displayName?: '';
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_KEY = 'AIzaSyCIdkdOGlr1Bi94i5K829s7d-I8XhDGeAc';
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleError),
        tap((response) => {
          const { email, localId, idToken, expiresIn } = response;
          this.handleAuthentication(email, localId, idToken, +expiresIn);
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleError),
        tap((response) => {
          const { email, localId, idToken, expiresIn } = response;
          this.handleAuthentication(email, localId, idToken, +expiresIn);
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationData: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationData)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationData).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An undetected error occurred!';
    if (!errorResponse.error || !errorResponse.error.error)
      return throwError(errorMessage);
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS': {
        errorMessage =
          'The email address is already in use by another account.';
        break;
      }
      case 'EMAIL_NOT_FOUND': {
        errorMessage =
          'There is no user record corresponding to this identifier. The user may have been deleted.';
        break;
      }
      case 'INVALID_PASSWORD': {
        errorMessage =
          'The password is invalid or the user does not have a password.';
        break;
      }
      default:
        errorMessage = 'An undetected error occurred!';
    }
    return throwError(errorMessage);
  }
}
