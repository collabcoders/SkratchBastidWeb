import { Component, inject, signal, ChangeDetectionStrategy, AfterViewInit, WritableSignal, effect, OnInit, ChangeDetectorRef, ViewChild, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AlertService } from '@shared/services/alert.service';
import { ApiService } from '@shared/services/api.service';
import { Config } from '@shared/config';
import { TokenService } from '@shared/services/token.service';
import { FavoritesService } from '@shared/services/favorites.service';
import { UploaderService } from '@shared/services/uploader.service';
import { AppData } from '../app.data';
import { NgxStripeModule, StripeService, StripeCardComponent } from 'ngx-stripe';
import { environment } from '@env/environment';
import { RecaptchaModule } from '../lib';
import { RecaptchaErrorParameters } from '../lib';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import countriesJson from '../../assets/data/countries.json';
import { Event as EventModel } from '@shared/models/event';
import { EventCardComponent } from '../components/event-card/event-card.component';
import { firstValueFrom } from 'rxjs';

declare var $: any;
declare var bootstrap: any;

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  action?: () => void;
}

type PricingOption = {
  value: string;
  text: string;
};


@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NgxStripeModule, RecaptchaModule, ImageCropperModule, EventCardComponent],
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsComponent implements AfterViewInit, OnInit {
    private static readonly modalRetryDelay = 1000;
    private static readonly modalRetryCount = 10;
    private readonly injector = inject(Injector);
    apiPost(endpoint: string) {
      const payload = this.registerForm.getRawValue();
      console.log('registerForm.value', payload);
      if (this.selectedPrice === 'free') {
        // No payment method required
      } else {
        if (!payload.paymentMethodId) {
          this.registerLoading.set(false);
          return;
        }
      }
      this.apiService.post(endpoint + '?app=' + Config.app + '&source=website', payload, true, true)
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
              if (data?.data) {
                this.token.set(data.data);
                this.token.isValid(true);
                this.favoritesService.loadFavorites();
              }
              // HIDE REGISTER MODAL
              this.closeRegisterModal();
              // SHOW MESSAGES AND REDIRECT
              bootbox.alert('<h4>Welcome ' + (this.isReJoin ? 'back ' : '') + 'to the Top Grillin\'</h4><br>' + data.msg);
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
    @ViewChild(StripeCardComponent) card!: StripeCardComponent;
    processingSignup = false;
    // Add paymentMethodId and paymentMethodLast4 to registerForm if not present
    // Stripe/plan properties for registration
    selectedPrice: string = '';
    selectedFrequency: string = '';
    isReJoin: boolean = false;

    // Stripe integration
    private stripeService = inject(StripeService);
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
      hidePostalCode: false,
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
  cropImgPreview = '/assets/images/user.png';
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
  cardComplete = false;
  cardErrorMessage = '';

  ngOnInit(): void {
    this.loadUpcomingEvents();
  }

  constructor(private fb: FormBuilder, private appData: AppData, private alertService: AlertService, private apiService: ApiService, private token: TokenService, private favoritesService: FavoritesService, private uploader: UploaderService, private cdr: ChangeDetectorRef,) {
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
      selectedPrice: [''],
      paymentMethodId: [''],
      paymentMethodLast4: [''],
    }, { validators: this.passwordsMatchValidator });

    // Listen for plan changes to update selectedPrice and selectedFrequency
    this.registerForm.get('plan')?.valueChanges.subscribe((plan) => {
      const monthlyVal = this.monthlyOptionValue();
      const yearlyVal = this.yearlyOptionValue();

      if (plan === 'free') {
        this.selectedPrice = 'free';
        this.selectedFrequency = '';
      } else if (plan === monthlyVal) {
        const { price, frequency } = this.extractPriceAndFrequency(this.monthlyOption()?.text);
        this.selectedPrice = price;
        this.selectedFrequency = frequency;
      } else if (plan === yearlyVal) {
        const { price, frequency } = this.extractPriceAndFrequency(this.yearlyOption()?.text);
        this.selectedPrice = price;
        this.selectedFrequency = frequency;
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

    this.uploader.progressSource.subscribe((p) => {
      this.progress = p || 0;
      this.cdr.markForCheck();
    });

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
          this.token.isValid(true);
          this.favoritesService.loadFavorites();
          this.hideModal('loginModal');
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
    this.registerForm.markAllAsTouched();

    if (this.selectedPrice === 'free') {
      // No-op for now, handled below
    } else {
      // No-op for now, handled below
    }
    if (this.registerForm.valid) {
      this.registerLoading.set(true);
      let endpoint = 'NewMember';
      if (this.selectedPrice == 'free') {
        this.registerForm.patchValue({
          plan: 'free',
          selectedPrice: ''
        });
      } else {
        this.registerForm.patchValue({
          selectedPrice: this.selectedPrice
        });
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
        if (!this.cardComplete) {
          this.registerLoading.set(false);
          const message = this.cardErrorMessage || 'Please complete your card details, including ZIP/postal code.';
          this.alertService.error('Error', message, Config.alertOptions);
          return;
        }
        // Stripe payment method creation
        this.stripeService.createPaymentMethod({
          type: 'card',
          card: this.card.element,
        }).subscribe((p: any) => {
          console.log('Payment Method', p);
          if (p.error?.message) {
            this.registerLoading.set(false);
            this.cardErrorMessage = p.error.message;
            this.alertService.error('Error', p.error.message, Config.alertOptions);
            return;
          }
          this.cardErrorMessage = '';
          this.registerForm.patchValue({
            paymentMethodId: p.paymentMethod?.id,
            paymentMethodLast4: p.paymentMethod?.card?.last4 || '',
          });
          this.apiPost(endpoint);
        });
      }
    }
  }

  onCardChange(event: any) {
    this.cardComplete = !!event?.complete;
    this.cardErrorMessage = event?.error?.message || '';
  }

  canSubmitRegister(): boolean {
    if (this.registerLoading()) {
      return false;
    }
    if (!this.registerForm.valid) {
      return false;
    }
    const requiresCard = this.selectedPrice !== '' && this.selectedPrice !== 'free';
    return !requiresCard || this.cardComplete;
  }

  ngAfterViewInit() {
    // Attach profile modal load hook without redirecting on close
    const profileEl = document.getElementById('profileModal');
    if (profileEl) {
      profileEl.addEventListener('show.bs.modal', () => {
        this.loadProfileModal(false);
      });
    }

    this.router.events.subscribe((event: any) => {
      if (!(event instanceof NavigationEnd) || !event.url) {
        return;
      }

      const isAuthenticated = !!this.token.getToken() && !this.token.isExpired();
      const selectedPlanId = this.getPlanIdFromUrl(event.url);

      if (event.url.includes('/login')) {
        if (isAuthenticated) {
          return;
        }
        this.runWhenModalLibraryReady(() => this.openLoginModal());
        return;
      }

      if (event.url.includes('/join')) {
        if (isAuthenticated) {
          return;
        }
        this.runWhenModalLibraryReady(() => this.openRegisterModal(selectedPlanId));
        return;
      }

      if (event.url.includes('/privacypolicy')) {
        this.runWhenModalLibraryReady(() => this.openPrivacyModal());
      } else if (event.url.includes('/cancelpolicy')) {
        this.runWhenModalLibraryReady(() => this.openCancelModal());
      } else if (event.url.includes('/refundpolicy')) {
        this.runWhenModalLibraryReady(() => this.openRefundModal());
      } else if (event.url.includes('/contact')) {
        this.runWhenModalLibraryReady(() => this.openContactModal());
      } else if (event.url.includes('/events')) {
        this.runWhenModalLibraryReady(() => this.openUpcomingEventsModal());
      }
    });

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const plan = this.appData.planOpen();
        if (!plan) {
          return;
        }

        if (plan === 'free') {
          this.registerForm.get('plan')?.setValue('free');
        } else if (plan === 'monthly') {
          this.registerForm.get('plan')?.setValue(this.monthlyOptionValue());
        } else if (plan === 'yearly') {
          this.registerForm.get('plan')?.setValue(this.yearlyOptionValue());
        }
      });
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

  private showModal(modalId: string, options?: any, retries = FormsComponent.modalRetryCount) {
    const el = document.getElementById(modalId);
    if (!el) {
      if (retries > 0) {
        setTimeout(() => this.showModal(modalId, options, retries - 1), FormsComponent.modalRetryDelay);
      }
      return;
    }

    if (typeof bootstrap !== 'undefined' && bootstrap?.Modal) {
      const modal = bootstrap.Modal.getInstance(el) || new bootstrap.Modal(el, options);
      modal.show();
    } else if (typeof $ !== 'undefined' && typeof $.fn?.modal === 'function') {
      $('#' + modalId).modal('show');
    } else if (retries > 0) {
      setTimeout(() => this.showModal(modalId, options, retries - 1), FormsComponent.modalRetryDelay);
    }
  }

  private runWhenModalLibraryReady(action: () => void, retries = FormsComponent.modalRetryCount) {
    if (this.isModalLibraryReady()) {
      setTimeout(action, 0);
      return;
    }

    if (retries > 0) {
      setTimeout(
        () => this.runWhenModalLibraryReady(action, retries - 1),
        FormsComponent.modalRetryDelay
      );
    }
  }

  private isModalLibraryReady(): boolean {
    const globalWindow = window as typeof window & {
      jQuery?: any;
      $?: any;
    };
    const jqueryScriptPresent = !!document.querySelector('script[src*="jquery"]');
    const jqueryLoaded =
      typeof $ !== 'undefined' &&
      typeof $.fn?.modal === 'function' &&
      !!globalWindow.jQuery;

    return !!(
      (typeof bootstrap !== 'undefined' && bootstrap?.Modal) ||
      (jqueryScriptPresent && jqueryLoaded) ||
      (typeof globalWindow.$ !== 'undefined' && typeof globalWindow.$?.fn?.modal === 'function')
    );
  }

  private hideModal(modalId: string) {
    const el = document.getElementById(modalId);
    if (!el) { return; }
    if (typeof bootstrap !== 'undefined') {
      const modal = bootstrap.Modal.getInstance(el);
      if (modal) { modal.hide(); }
    } else if (typeof $ !== 'undefined') {
      $('#' + modalId).modal('hide');
    }
  }

  openLoginModal() {
    this.showModal('loginModal', { backdrop: 'static', keyboard: false });
  }

  openRegisterModal(selectedPlanId?: string | null) {
    this.resetRegisterForm();
    this.applySelectedPlan(selectedPlanId);
    this.showModal('registerModal', { backdrop: 'static', keyboard: false });
  }

  private closeRegisterModal() {
    this.hideModal('registerModal');
  }

  private resetRegisterForm() {
    this.registerForm.reset({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      confirmPassword: '',
      plan: '',
      selectedPrice: '',
      paymentMethodId: '',
      paymentMethodLast4: '',
    });
    this.registerForm.markAsPristine();
    this.registerForm.markAsUntouched();
    this.selectedPrice = '';
    this.selectedFrequency = '';
    this.cardComplete = false;
    this.cardErrorMessage = '';
    this.isReJoin = false;
    (this.registerForm as any).formSubmitAttempt = false;
    this.cdr.markForCheck();
  }

  openContactModal() {
    this.showModal('contactModal');
  }

  openProfileModal() {
    this.loadProfileModal(true);
  }

  openChangePasswordModal() {
    this.passwordForm.reset();
    this.processingPassword = false;
    this.showModal('changePasswordModal');
  }

  private loadProfileModal(openAfterLoad: boolean) {
    this.alertService.clear();
    this.processingProfile = false;
    this.imageChanged = false;
    this.imgChangeEvt = null;
    this.imageUrl = '';
    this.fileName = 'No file selected';
    this.imageType = 'image/jpeg';
    this.isUploading = false;
    this.progress = 0;
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
          sms: !!this.memberProfile?.sms,
          city: this.memberProfile?.city || '',
          state: this.memberProfile?.state || '',
          country: this.memberProfile?.country || '',
          password: this.memberProfile?.password || '',
          confirmPassword: this.memberProfile?.password || '',
        });
        this.profileForm.markAsPristine();
        this.cdr.markForCheck();

        if (openAfterLoad) {
          this.showModal('profileModal');
        }
      },
      error: (error: any) => {
        this.alertService.error('Error', error?.error?.message || 'Unable to load profile.', Config.alertOptions);
      }
    });
  }

  openPrivacyModal() { this.showModal('privacyModal'); }
  openCancelModal() { this.showModal('cancelModal'); }
  openRefundModal() { this.showModal('refundModal'); }

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
            // HIDE CONTACT MODAL
            this.hideModal('contactModal');
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
    if (this.cropImgPreview) {
      this.profileForm.patchValue({ image: this.cropImgPreview });
    }
    if (this.profileForm.invalid) {
      return;
    }
    this.saveProfile();
  }

  async saveProfile() {
    this.processingProfile = true;
    this.cdr.markForCheck();

    let imageValue = this.profileForm.get('image')?.value || '';
    const shouldUpload = !!imageValue && imageValue?.startsWith('data:image');

    console.log("shouldUpload", shouldUpload);
    console.log("shouldUpload", this.cropImgPreview, imageValue);
    if (shouldUpload) {
      try {
        imageValue = await this.uploadCroppedImage();
        this.profileForm.patchValue({ image: imageValue });
      } catch (err: any) {
        this.processingProfile = false;
        this.alertService.error('Error', err?.message || 'Image upload failed.', Config.alertOptions);
        this.cdr.markForCheck();
        return;
      }
    } else if (this.cropImgPreview && !imageValue) {
      imageValue = this.cropImgPreview;
    }

    const payload = { ...this.profileForm.value } as any;
    payload.sms = this.profileForm.get('sms')?.value ? 1 : 0;
    payload.image = imageValue || '';

    this.apiService.post('UpdateMember?app=' + Config.app, payload, true, true)
      .subscribe({
        next: (data: any) => {
          if (data.error) {
            this.alertService.error('Error', data.msg, Config.alertOptions);
          } else {
            this.alertService.success('Saved', data.msg, Config.alertOptions);
            this.hideModal('profileModal');
          }
          this.processingProfile = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.processingProfile = false;
          this.alertService.error('', error?.error?.message || error?.message || 'Something went wrong!', Config.alertOptions);
          this.cdr.markForCheck();
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
            this.hideModal('changePasswordModal');
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
    this.fileName = file.name || 'avatar.png';
    this.imageType = file.type;
    this.imgChangeEvt = event;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.imageUrl = base64;
      this.imageChanged = true;
      this.cropImgPreview = base64;
      this.profileForm.patchValue({ image: base64 });
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  cropImg(event: ImageCroppedEvent) {
    this.cropImgPreview = event.base64 || '';
    if (this.cropImgPreview) {
      this.profileForm.patchValue({ image: this.cropImgPreview });
    }
    this.imageChanged = !!this.cropImgPreview;
    this.cdr.markForCheck();
  }

  private dataURItoBlob(dataURI: string): Blob {
    const parts = dataURI.split(',');
    const byteString = atob(parts[1] || '');
    const mimeString = parts[0]?.split(':')[1]?.split(';')[0] || this.imageType || 'image/png';
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  private async uploadCroppedImage(): Promise<string> {
    let imageValue = this.profileForm.get('image')?.value || '';
    if (!imageValue) {
      throw new Error('No image to upload.');
    }
    const blob = this.dataURItoBlob(imageValue);
    const fileName = this.fileName || 'avatar.png';
    const mimeType = this.imageType || 'image/png';
    const file = new File([blob], fileName, { type: mimeType });

    this.isUploading = true;
    this.cdr.markForCheck();

    try {
      const result = await firstValueFrom(this.uploader.upload(file));
      if (typeof result !== 'string' || !result) {
        throw new Error('Image upload failed.');
      }
      if (result.startsWith('Server Error')) {
        throw new Error(result);
      }
      return result;
    } finally {
      this.isUploading = false;
      this.cdr.markForCheck();
    }
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
          // this.upcomingEvents = filteredByDate(data?.data || []);
          this.upcomingEvents = (data?.data || []);
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

    this.showModal('upcomingEventsModal');
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

  onSmsChange(event: Event) {
    const checked = (event.target as HTMLInputElement)?.checked;
    this.profileForm.get('sms')?.setValue(checked, { emitEvent: true });
    this.profileForm.get('sms')?.markAsDirty();
    console.log("onSmsChange", checked);
  }

  private monthlyOption(): PricingOption | undefined {
    return this.appData.pricingOptions().find((option) => /monthly/i.test(option.text));
  }

  private yearlyOption(): PricingOption | undefined {
    return this.appData.pricingOptions().find((option) => /yearly/i.test(option.text));
  }

  monthlyOptionValue(): string {
    return this.monthlyOption()?.value || 'monthly';
  }

  yearlyOptionValue(): string {
    return this.yearlyOption()?.value || 'yearly';
  }

  monthlyOptionLabel(): string {
    return this.monthlyOption()?.text || 'Monthly';
  }

  yearlyOptionLabel(): string {
    return this.yearlyOption()?.text || 'Yearly';
  }

  private getPlanIdFromUrl(url: string): string | null {
    try {
      const queryParams = this.router.parseUrl(url).queryParams;
      return typeof queryParams['id'] === 'string' ? queryParams['id'] : null;
    } catch {
      return null;
    }
  }

  private applySelectedPlan(selectedPlanId?: string | null) {
    if (!selectedPlanId) {
      return;
    }

    if (selectedPlanId === 'free') {
      this.appData.planOpen.set('free');
      this.registerForm.get('plan')?.setValue('free');
      return;
    }

    if (selectedPlanId === this.monthlyOptionValue()) {
      this.appData.planOpen.set('monthly');
    } else if (selectedPlanId === this.yearlyOptionValue()) {
      this.appData.planOpen.set('yearly');
    }

    this.registerForm.get('plan')?.setValue(selectedPlanId);
  }

  private extractPriceAndFrequency(text?: string): { price: string; frequency: string } {
    if (!text) {
      return { price: '', frequency: '' };
    }
    const [price, freq] = text.split('/');
    return {
      price: price?.trim() || '',
      frequency: (freq || '').trim().toLowerCase() || '',
    };
  }
}
