import { Component, inject, signal, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '@shared/services/alert.service';
import { ApiService } from '@shared/services/api.service';
import { Config } from '@shared/config';
import { TokenService } from '@shared/services/token.service';

declare var $: any;
declare var bootstrap: any;

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  action?: () => void;
}


@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsComponent implements AfterViewInit {
  public router = inject(Router);

  // Reactive Forms
  loginForm: FormGroup;
  resetForm: FormGroup;
  registerForm: FormGroup;

  loginLoading = signal(false);
  resetLoading = false;
  registerLoading = false;

  constructor(private fb: FormBuilder, private alertService: AlertService, private apiService: ApiService, private token: TokenService,) {
    this.router = inject(Router);

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10,}')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      plan: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });

    // Listen for router navigation to policy routes and open modal only on NavigationEnd
    this.router.events.subscribe((event: any) => {
      if (event?.constructor?.name === 'NavigationEnd' && event.url) {
        if (event.url.includes('/privacypolicy')) {
          setTimeout(() => this.openPrivacyModal(), 0);
        } else if (event.url.includes('/cancelpolicy')) {
          setTimeout(() => this.openCancelModal(), 0);
        } else if (event.url.includes('/refundpolicy')) {
          setTimeout(() => this.openRefundModal(), 0);
        } else if (event.url.includes('/contact')) {
          setTimeout(() => this.openContactModal(), 0);
        } else if (event.url.includes('/login')) {
          setTimeout(() => this.openLoginModal(), 0);
        } else if (event.url.includes('/join')) {
          setTimeout(() => this.openRegisterModal(), 0);
        }
      }
    });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordsMismatch: true };
  }

  appData = { loginFromBeats: false };
  showReJoin(id: any) { bootbox.alert('Upgrade logic for id: ' + id); }

  onLoginSubmit() {
    this.alertService.clear();
    if (this.loginForm.invalid) {
      this.alertService.error('Error', 'Invalid Email/Password');
      this.loginLoading.set(false);
      return;
    }
    this.loginLoading.set(true);
    this.apiService.post('MemberLogin?app=skratchbastid',{username: this.loginForm.value.email,...this.loginForm.value}, true, true)
      .subscribe((data: any) => {
        this.loginLoading.set(false);
        console.log("MemberLogin", data);
        if (data.error) {
          this.alertService.error('Error', data.msg);
        } else {
          this.token.set(data.data);
          if (typeof bootstrap !== 'undefined') {
            const modalEl = document.getElementById('loginModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) {
              modalInstance.hide();
            }
          } else if (typeof $ !== 'undefined') {
            $('#loginModal').modal('hide');
          }
          if (['expired', 'inactive', 'canceled'].includes(data.data.status)) {
            if (!this.appData.loginFromBeats) {
              bootbox.dialog({
                message: data.msg,
                buttons: {
                  ok: {
                    label: 'Upgrade',
                    callback: () => {
                      this.showReJoin(data.data.id);
                    }
                  }
                }
              });
            }
          } else {
            this.loginLoading.set(false);
            if (data.msg && data.msg.indexOf('Your Beat Making Course') !== -1) {
              bootbox.alert(data.msg);
            } else {
              this.alertService.success('Sign-In Successful', data.msg);
              // setTimeout(() => window.location.reload(), 1000);
            }
          }
        }
      }, (error) => {
        this.loginLoading.set(false);
        this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
      });
  }

  onResetSubmit() {
    if (this.resetForm.invalid) return;
    this.resetLoading = true;
    setTimeout(() => {
      this.resetLoading = false;
      // TODO: handle reset logic
    }, 1500);
  }

  onRegisterSubmit() {
    if (this.registerForm.invalid) return;
    this.registerLoading = true;
    setTimeout(() => {
      this.registerLoading = false;
      // TODO: handle register logic
    }, 1500);
  }

  ngAfterViewInit() {
    // Listen for Bootstrap modal close events and navigate to '/'
    const modalIds = [
      'loginModal',
      'registerModal',
      'contactModal',
      'privacyModal',
      'cancelModal',
      'refundModal',
    ];
    modalIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('hidden.bs.modal', () => {
          this.router.navigate(['/']);
        });
      }
    });
  }
  // ...existing code...

  handleLinkClick(link: FooterLink) {
    // If the link is a policy route, open modal instead of navigating
    if (link.href === '/privacypolicy') {
      this.openPrivacyModal();
      return false;
    }
    if (link.href === '/cancelpolicy') {
      this.openCancelModal();
      return false;
    }
    if (link.href === '/refundpolicy') {
      this.openRefundModal();
      return false;
    }
    if (link.action) {
      link.action();
    }
    return true;
  }

  openLoginModal() {
    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(document.getElementById('loginModal'));
      modal.show();
    } else if (typeof $ !== 'undefined') {
      $('#loginModal').modal('show');
    }
  }

  openRegisterModal() {
    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(document.getElementById('registerModal'));
      modal.show();
    } else if (typeof $ !== 'undefined') {
      $('#registerModal').modal('show');
    }
  }

  openContactModal() {
    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(document.getElementById('contactModal'));
      modal.show();
    } else if (typeof $ !== 'undefined') {
      $('#contactModal').modal('show');
    }
  }

  openPrivacyModal() {
    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(document.getElementById('privacyModal'));
      modal.show();
    } else if (typeof $ !== 'undefined') {
      $('#privacyModal').modal('show');
    }
  }

  openCancelModal() {
    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(document.getElementById('cancelModal'));
      modal.show();
    } else if (typeof $ !== 'undefined') {
      $('#cancelModal').modal('show');
    }
  }

  openRefundModal() {
    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(document.getElementById('refundModal'));
      modal.show();
    } else if (typeof $ !== 'undefined') {
      $('#refundModal').modal('show');
    }
  }
}
