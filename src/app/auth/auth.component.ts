import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { PlaceholderDirective } from 'src/shared/placeholder/placeholder.directive';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AppState } from '../store/app.reducer';
import * as authActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;

  private storeSub: Subscription;
  private closeSub: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe((authState) => {
      this.isLoading = authState.isLoading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    this.storeSub.unsubscribe();
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    const { email, password } = form.value;

    if (this.isLoginMode) {
      this.store.dispatch(new authActions.LoginStart({ email, password }));
    } else {
      this.store.dispatch(new authActions.SignupStart({ email, password }));
    }

    form.reset();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.store.dispatch(new authActions.ClearError());
  }

  onHandleError() {
    this.store.dispatch(new authActions.ClearError());
  }

  private showErrorAlert(message: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
