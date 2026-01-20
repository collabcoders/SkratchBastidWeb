import { Component, inject, signal, ChangeDetectionStrategy, AfterViewInit, WritableSignal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '@shared/services/alert.service';
import { ApiService } from '@shared/services/api.service';
import { Config } from '@shared/config';
import { TokenService } from '@shared/services/token.service';
import { AppData } from '../app.data';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from '@env/environment';
import { RecaptchaModule } from '../lib';
import { RecaptchaErrorParameters } from '../lib';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import countriesJson from '../../assets/data/countries.json';
import { Event as EventModel } from '@shared/models/event';
import { EventCardComponent } from '../components/event-card/event-card.component';

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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NgxStripeModule, RecaptchaModule, ImageCropperModule, EventCardComponent],
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsComponent implements AfterViewInit, OnInit {
    apiPost(endpoint: string) {
      // Use registerForm for this context
      console.log('registerForm.value', this.registerForm.value);
      if (this.selectedPrice === 'free') {
        // No payment method required
      } else {
        if (!this.registerForm.value.paymentMethodId) {
          this.registerLoading.set(false);
          return;
        }
      }
      this.apiService.post(endpoint + '?app=' + Config.app + '&source=website', this.registerForm.value, true, true)
        .subscribe({
          next: (data: any) => {
            if (data.error) {
              // SHOW ERROR MESSAGE
              console.log(data);
              this.alertService.error('Error', data.msg, Config.alertOptions);
              setTimeout(() => {
                this.registerLoading.set(false);
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
                this.registerLoading.set(false);
              }, 400);
            }
          },
          error: (error) => {
            this.registerLoading.set(false);
            this.alertService.error('', error?.error?.message || error?.message || 'Something went wrong!', Config.alertOptions);
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
        theme: 'flat' as 'flat' | 'stripe' | 'night',
        variables: {
          colorText: '#111827',
          colorPrimary: '#FF5941',
          colorTextPlaceholder: '#6b7280',
          colorBackground: '#ffffff',
        },
      },
    };
    cardOptions = {
      style: {
        base: {
          iconColor: '#111827',
          color: '#111827',
          fontWeight: '400',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSize: '18px',
          '::placeholder': {
            color: '#6b7280',
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
  profileForm: FormGroup;
  passwordForm: FormGroup;
  memberProfile: any = null;
  showcaptcha = true;
  okcaptcha = false;
  processingContact = false;
  processingProfile = false;
  processingPassword = false;
  captchaKey: string = environment?.captcha?.key || '';

  // Upcoming events modal state
  upcomingEvents: EventModel[] = [];
  isLoadingUpcoming: WritableSignal<boolean> = signal(false);

  // Profile modal state
  countries: any = (countriesJson as any) || [];
  cropImgPreview = 'https://magmob.djjazzyjeff.com/content/user.png';
  imgChangeEvt: any = null;
  imageChanged = false;
  imageType = 'image/jpeg';
  fileName = 'No file selected';
  imageUrl: string | ArrayBuffer | null = '';
  progress = 0;
  infoMessage: string | null = null;
  isUploading = false;
  subscrSum = '';
  cancelOption = false;

  loginLoading = signal(false);
  resetLoading = signal(false);
  registerLoading = signal(false);

  ngOnInit(): void {
    this.loadUpcomingEvents();
  }

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
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
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
      phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9\\s\\-]{7,}$')]],
      email: ['', [Validators.required, Validators.email]],
      topic: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });

    this.profileForm = this.fb.group({
      alias: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9\\s\\-]{7,}$')]],
      sms: [true],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      image: [''],
      memberId: [''],
    }, { validators: this.passwordsMatchValidator });

    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
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
        } else if (event.url.includes('/events')) {
          setTimeout(() => this.openUpcomingEventsModal(), 0);
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
    const password = form.get('password') || form.get('newPassword');
    const confirm = form.get('confirmPassword');
    const passwordVal = password?.value;
    const confirmVal = confirm?.value;
    return passwordVal === confirmVal ? null : { passwordsMismatch: true };
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
    this.apiService.post(`MemberLogin?app=${environment.projectid}`,{username: this.loginForm.value.email,...this.loginForm.value}, true, true)
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
    this.resetLoading.set(true);
    setTimeout(() => {
      this.resetLoading.set(false);
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
      this.registerLoading.set(true);
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
            this.registerLoading.set(false);
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
      'profileModal',
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
        if (id === 'profileModal') {
          el.addEventListener('show.bs.modal', () => {
            this.loadProfileModal(false);
          });
        }
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

  openProfileModal() {
    this.loadProfileModal(true);
  }

  openChangePasswordModal() {
    this.passwordForm.reset();
    this.processingPassword = false;
    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
      modal.show();
    } else if (typeof $ !== 'undefined') {
      $('#changePasswordModal').modal('show');
    }
  }

  private loadProfileModal(openAfterLoad: boolean) {
    this.alertService.clear();
    this.processingProfile = false;
    this.imageChanged = false;
    this.profileForm.reset();
    this.passwordForm.reset();
    this.cropImgPreview = 'https://magmob.djjazzyjeff.com/content/user.png';

    const member = this.token.getMember();
    const memberId = member?.memberId || 0;

    this.subscrSum = 'Loading Subscription Info...';
    this.cancelOption = false;

    this.apiService.getItem('member', memberId, '', false).subscribe({
      next: (data: any) => {
        this.memberProfile = data?.data;
        const imagePath = this.memberProfile?.image || '';
        const resolvedImage = imagePath?.startsWith('http') ? imagePath : (imagePath ? `${Config.content}${imagePath}` : this.cropImgPreview);
        this.cropImgPreview = resolvedImage;

        this.subscrSum = '';
        this.profileForm.patchValue({
          memberId: this.memberProfile?.memberId || '',
          alias: this.memberProfile?.alias || '',
          image: imagePath || '',
          firstName: this.memberProfile?.firstName || '',
          lastName: this.memberProfile?.lastName || '',
          email: this.memberProfile?.email || '',
          phone: this.memberProfile?.phone || '',
          sms: this.memberProfile?.sms ?? true,
          city: this.memberProfile?.city || '',
          state: this.memberProfile?.state || '',
          country: this.memberProfile?.country || '',
          password: this.memberProfile?.password || '',
          confirmPassword: this.memberProfile?.password || '',
        });
        this.profileForm.markAsPristine();

        if (openAfterLoad) {
          if (typeof bootstrap !== 'undefined') {
            const modal = new bootstrap.Modal(document.getElementById('profileModal'));
            modal.show();
          } else if (typeof $ !== 'undefined') {
            $('#profileModal').modal('show');
          }
        }
      },
      error: (error: any) => {
        this.alertService.error('Error', error?.error?.message || 'Unable to load profile.', Config.alertOptions);
      }
    });
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
    if (!this.okcaptcha) {
      this.alertService.error('', 'Please complete the captcha.', Config.alertOptions);
      return;
    }
    if (this.contactForm.valid) {
      this.processingContact = true;
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
              this.processingContact = false;
              this.isLoadingContact.set(false);
            }, 400);
          } else {
            this.contactForm.reset();
            this.okcaptcha = false;
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
              this.processingContact = false;
              this.isLoadingContact.set(false);
            }, 400);
          }
        });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  initSaveProfile() {
    this.alertService.clear();
    this.profileForm.markAllAsTouched();
    if (this.imageChanged && this.cropImgPreview) {
      this.profileForm.patchValue({ image: this.cropImgPreview });
    }
    if (this.profileForm.invalid) {
      return;
    }
    this.saveProfile();
  }

  saveProfile() {
    this.processingProfile = true;
    const payload = { ...this.profileForm.value };
    this.apiService.post('UpdateMember?app=' + Config.app, payload, true, true)
      .subscribe({
        next: (data: any) => {
          if (data.error) {
            this.alertService.error('Error', data.msg, Config.alertOptions);
          } else {
            this.alertService.success('Saved', data.msg, Config.alertOptions);
            if (typeof bootstrap !== 'undefined') {
              const modalEl = document.getElementById('profileModal');
              const instance = bootstrap.Modal.getInstance(modalEl);
              if (instance) {
                instance.hide();
              }
            } else if (typeof $ !== 'undefined') {
              $('#profileModal').modal('hide');
            }
          }
          this.processingProfile = false;
        },
        error: (error) => {
          this.processingProfile = false;
          this.alertService.error('', error?.error?.message || error?.message || 'Something went wrong!', Config.alertOptions);
        }
      });
  }

  savePassword() {
    this.alertService.clear();
    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.invalid) {
      return;
    }

    const memberId = this.profileForm.get('memberId')?.value || this.memberProfile?.memberId || this.token.getMember()?.memberId;
    if (!memberId) {
      this.alertService.error('Error', 'Unable to determine member ID.', Config.alertOptions);
      return;
    }

    const payload = {
      memberId,
      password: this.passwordForm.get('newPassword')?.value,
      confirmPassword: this.passwordForm.get('confirmPassword')?.value,
    };

    this.processingPassword = true;
    this.apiService.post('UpdateMember?app=' + Config.app, payload, true, true)
      .subscribe({
        next: (data: any) => {
          if (data.error) {
            this.alertService.error('Error', data.msg, Config.alertOptions);
          } else {
            this.alertService.success('Password Updated', data.msg, Config.alertOptions);
            if (typeof bootstrap !== 'undefined') {
              const modalEl = document.getElementById('changePasswordModal');
              const instance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
              instance.hide();
            } else if (typeof $ !== 'undefined') {
              $('#changePasswordModal').modal('hide');
            }
            this.passwordForm.reset();
          }
          this.processingPassword = false;
        },
        error: (error) => {
          this.processingPassword = false;
          this.alertService.error('', error?.error?.message || error?.message || 'Something went wrong!', Config.alertOptions);
        }
      });
  }

  onProfileFileChange(event: any) {
    const input = event?.target as HTMLInputElement | null;
    if (!input || !input?.files || input?.files?.length === 0) {
      return;
    }
    const file = input?.files[0];
    this.fileName = file.name;
    this.imageType = file.type;
    this.imgChangeEvt = event;
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result;
      this.imageChanged = true;
    };
    reader.readAsDataURL(file);
  }

  cropImg(event: ImageCroppedEvent) {
    this.cropImgPreview = event.base64 || '';
  }

  imgLoad() {
    // cropper ready
  }

  initCropper() {
    // cropper initialized
  }

  imgFailed() {
    this.alertService.error('Error', 'Image failed to load. Please try another file.', Config.alertOptions);
  }

  showCancel(e: Event) {
    e?.preventDefault();
    this.openCancelModal();
  }

  resolved(captchaResponse: string | null) {
    this.okcaptcha = !!captchaResponse;
  }

  onError(_error: RecaptchaErrorParameters) {
    this.okcaptcha = false;
  }

  invalid(control: AbstractControl | null): boolean {
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  loadUpcomingEvents() {
    this.isLoadingUpcoming.set(true);

    const filteredByDate = (events: any[] = []) => {
      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);

      return events.filter((event: any) => {
        if (!event?.date) return false;
        const eventDate = new Date(event.date);
        return eventDate <= tomorrow;
      });
    };

    if (environment.ismock) {
      this.apiService.getSectionData('event').subscribe({
        next: (data) => {
          const events = data?.data?.filter((event: any) => event.upcoming === true) || [];
          this.upcomingEvents = events;
          // this.upcomingEvents = filteredByDate(events);
          this.isLoadingUpcoming.set(false);
        },
        error: (error) => {
          this.isLoadingUpcoming.set(false);
          this.alertService.error('', error?.error?.message || error?.message || 'Something went wrong!', Config.alertOptions);
        },
      });
    } else {
      this.apiService.getData('events', '', '').subscribe({
        next: (data: any) => {
          this.upcomingEvents = filteredByDate(data?.data || []);
          this.isLoadingUpcoming.set(false);
        },
        error: () => {
          this.isLoadingUpcoming.set(false);
        },
      });
    }
  }

  openUpcomingEventsModal() {
    if (!this.upcomingEvents.length) {
      this.loadUpcomingEvents();
    }

    if (typeof bootstrap !== 'undefined') {
      const modalEl = document.getElementById('upcomingEventsModal');
      if (modalEl) {
        const instance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        instance.show();
      }
    } else if (typeof $ !== 'undefined') {
      $('#upcomingEventsModal').modal('show');
    }
  }

  invalidCss(control: AbstractControl | null) {
    return { 'is-invalid': this.invalid(control) };
  }

  invalidProfile(control: AbstractControl | null): boolean {
    return this.invalid(control);
  }

  invalidProfileCss(control: AbstractControl | null) {
    return this.invalidCss(control);
  }
}
