import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as authTypes from './auth.types';
import * as authActions from './auth.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  displayName?: string;
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  private API_KEY = environment.firebaseAPIKey;

  handleAuthentication = (
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new authActions.AuthenticateSuccess({
      email,
      userId,
      token,
      expirationDate,
      redirect: true,
    });
  };

  handleError = (errorResponse) => {
    let errorMessage = 'An undetected error occurred!';
    if (!errorResponse.error || !errorResponse.error.error)
      return of(new authActions.AuthenticateFailure(errorMessage));
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
    return of(new authActions.AuthenticateFailure(errorMessage));
  };

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(authTypes.SINGUP_START),
    switchMap((signupAction: authActions.SignupStart) => {
      return this.http
        .post<AuthResponseData>(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`,
          {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          tap((resData) =>
            this.authService.setLogoutTimer(+resData.expiresIn * 1000)
          ),
          map((resData) =>
            this.handleAuthentication(
              resData.email,
              resData.localId,
              resData.idToken,
              +resData.expiresIn
            )
          ),
          catchError((errorResponse) => this.handleError(errorResponse))
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(authTypes.LOGIN_START),
    switchMap((authData: authActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          tap((resData) =>
            this.authService.setLogoutTimer(+resData.expiresIn * 1000)
          ),
          map((resData) =>
            this.handleAuthentication(
              resData.email,
              resData.localId,
              resData.idToken,
              +resData.expiresIn
            )
          ),
          catchError((errorResponse) => this.handleError(errorResponse))
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(authTypes.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: authActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(authTypes.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationData: string;
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) return { type: 'DUMMY' };

      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationData)
      );

      if (loadedUser.token) {
        const expirationDuration =
          new Date(userData._tokenExpirationData).getTime() -
          new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new authActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationData),
          redirect: false,
        });
      }
      return { type: 'DUMMY' };
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(authTypes.LOGOUT),
    tap(() => {
      this.authService.clearLougoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
