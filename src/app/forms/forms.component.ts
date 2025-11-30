import { Component, inject, signal, ChangeDetectionStrategy, AfterViewInit, WritableSignal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '@shared/services/alert.service';
import { ApiService } from '@shared/services/api.service';
import { Config } from '@shared/config';
import { TokenService } from '@shared/services/token.service';
import { AppData } from '../app.data';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from '@env/environment';

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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NgxStripeModule],
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsComponent implements AfterViewInit {
    apiPost(endpoint: string) {
      // Use registerForm for this context
      console.log('registerForm.value', this.registerForm.value);
      if (this.selectedPrice === 'free') {
        // No payment method required
      } else {
        if (!this.registerForm.value.paymentMethodId) {
          this.processingSignup = false;
          return;
        }
      }
      this.apiService.post(endpoint + '?app=' + Config.app + '&source=website', this.registerForm.value, true, true)
        .subscribe((data: any) => {
          if (data.error) {
            // SHOW ERROR MESSAGE
            console.log(data);
            this.alertService.error('Error', data.msg, Config.alertOptions);
            setTimeout(() => {
              this.processingSignup = false;
            }, 400);
          } else {
            // SET TOKEN
            console.log(data);
            if (this.isReJoin) {
              this.token.set(data?.data);
              // this.logIn.emit(); // Uncomment if you have logIn EventEmitter
            }
            // HIDE REGISTER MODAL
            if (typeof $ !== 'undefined') {
              $('#registerModal').modal('hide');
            }
            // SHOW MESSAGES AND REDIRECT
            bootbox.alert('<h4>Welcome ' + (this.isReJoin ? 'back ' : '') + 'to the QMT VIP</h4><br>' + data.msg);
            this.isReJoin = false;
            setTimeout(() => {
              this.processingSignup = false;
            }, 400);
          }
        });
    }
    // Add ViewChild for StripeCardComponent
    // @ViewChild(StripeCardComponent) card!: StripeCardComponent; // Uncomment and import if using StripeCardComponent
    processingSignup = false;
    // Add paymentMethodId and paymentMethodLast4 to registerForm if not present
    // Stripe/plan properties for registration
    selectedPrice: string = '';
    selectedFrequency: string = '';
    isReJoin: boolean = false;

    // Stripe integration
    stripe = (window as any).Stripe ? (window as any).Stripe('pk_test_123') : undefined; // Replace with your Stripe key or inject as needed
    elementsOptions = {
      locale: 'en' as 'auto' | 'en' | 'fr' | 'de' | 'es' | 'it' | 'ja' | 'pt' | 'zh',
      appearance: {
        theme: 'flat'
      }
    };
    cardOptions = {
      style: {
        base: {
          iconColor: '#fff',
          color: '#fff',
          fontWeight: '300',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSize: '18px',
          '::placeholder': {
            color: '#fff',
          },
        },
      },
    };
  public router = inject(Router);

  // Reactive Forms
  loginForm: FormGroup;
  resetForm: FormGroup;
  registerForm: FormGroup;
  contactForm: FormGroup;

  loginLoading = signal(false);
  resetLoading = false;
  registerLoading = false;

  constructor(private fb: FormBuilder, private appData: AppData, private alertService: AlertService, private apiService: ApiService, private token: TokenService,) {
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

    // Listen for plan changes to update selectedPrice and selectedFrequency
    this.registerForm.get('plan')?.valueChanges.subscribe((plan) => {
      if (plan === 'free') {
        this.selectedPrice = 'free';
        this.selectedFrequency = '';
      } else if (plan === 'monthly') {
        this.selectedPrice = '$9.99';
        this.selectedFrequency = 'monthly';
      } else if (plan === 'yearly') {
        this.selectedPrice = '$99.99';
        this.selectedFrequency = 'yearly';
      } else {
        this.selectedPrice = '';
        this.selectedFrequency = '';
      }
    });

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });

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

    effect(() => {
      if (this.appData.planOpen()) {
        if (this.appData.planOpen() === 'free') {
          this.registerForm.get('plan')?.setValue('free');
        } else if (this.appData.planOpen() === 'monthly') {
          this.registerForm.get('plan')?.setValue('monthly');
        } else if (this.appData.planOpen() === 'yearly') {
          this.registerForm.get('plan')?.setValue('yearly');
        }
      }
    })
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordsMismatch: true };
  }

  showReJoin(id: any) { bootbox.alert('Upgrade logic for id: ' + id); }

  onLoginSubmit() {
    this.alertService.clear();
    if (this.loginForm.invalid) {
      this.alertService.error('Error', 'Invalid Email/Password');
      this.loginLoading.set(false);
      return;
    }
    this.loginLoading.set(true);
    this.apiService.post('MemberLogin?app=djjazzyjeff',{username: this.loginForm.value.email,...this.loginForm.value}, true, true)
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
    this.alertService.clear();
    // Mark form as attempted
    (this.registerForm as any).formSubmitAttempt = true;

    if (this.selectedPrice === 'free') {
      // No-op for now, handled below
    } else {
      // No-op for now, handled below
    }
    if (this.registerForm.valid) {
      this.processingSignup = true;
      let endpoint = 'NewMember';
      if (this.selectedPrice == 'free') {
        this.registerForm.value.plan = 'free';
        this.registerForm.value.selectedPrice = '';
      } else {
        if (this.isReJoin) {
          endpoint = 'UpdateSubscription';
        } else {
          endpoint = 'NewSubscription';
        }
      }
      if (this.selectedPrice === 'free') {
        this.registerForm.patchValue({
          paymentMethodId: '',
          paymentMethodLast4: ''
        });
        this.apiPost(endpoint);
      } else {
        // Stripe payment method creation
        // You must have a reference to the StripeCardComponent as 'card'
        const payload: any = {
          type: 'card',
          card: (this as any).card?.element, // Replace with correct reference if needed
        };
        (this.stripe as any).createPaymentMethod(payload).subscribe((p: any) => {
          console.log('Payment Method', p);
          if (p.error?.message) {
            this.processingSignup = false;
            return;
          }
          this.registerForm.patchValue({
            paymentMethodId: p.paymentMethod?.id,
            paymentMethodLast4: p.paymentMethod?.card?.last4 || '',
          });
          this.apiPost(endpoint);
        });
      }
    }
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

  isLoadingContact: WritableSignal<boolean> = signal(false);
  saveContact() {
    this.alertService.clear();
    console.log("contactForm", this.contactForm);
    if (this.contactForm.valid) {
      this.isLoadingContact.set(true);
      let endpoint = 'Contact';
      const payload = this.contactForm.value;
      this.apiService.post(endpoint + '?app=' + Config.app, payload, true, true)
        .subscribe(data => {
          if (data.error) {
            // SHOW ERROR MESSAGE
            console.log(data);
            this.alertService.error('Error', data.msg, Config.alertOptions)
            setTimeout(() => {
              this.isLoadingContact.set(false);
            }, 400);
          } else {
            this.contactForm.reset();
            // SET TOKEN
            console.log(data);
            bootbox.alert(data);
            // HIDE LOGIN MODAL
            if (typeof bootstrap !== 'undefined') {
              const modal = new bootstrap.Modal(document.getElementById('contactModal'));
              modal.show();
            } else if (typeof $ !== 'undefined') {
              $('#contactModal').modal('show');
            }
            setTimeout(() => {
              this.isLoadingContact.set(false);
            }, 400);
          }
        });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
