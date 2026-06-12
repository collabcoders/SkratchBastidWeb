import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import { FormValidator } from '@shared/models/form-validator';
import { AlertService } from '@shared/services/alert.service';
import { LegendsPricingService } from '@shared/services/legends/pricing.service';
import { LegendsMemberService } from '@shared/services/legends/member.service';
import { HiveService } from '@shared/services/hive.service';
import { TokenService } from '@shared/services/token.service';
import { ValidationService } from '@shared/services/validation.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-upgrade',
  standalone: false,
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})

export class UpgradeComponent implements OnInit {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

  signupForm: FormValidator = {} as any;
  plans: any = [];
  accountEmail = '';
  accountName = '';
  alertOptions = {
    autoClose: true,
    keepAfterRouteChange: false
  };
  selectedPrice = '';
  selectedFrequency = '';
  processingSignup = false;
  submitted = false;
  confirmation = '';
  validToken = false;
  cardComplete = false;
  cardErrorMessage = '';
  cardOptions = {
    hidePostalCode: false,
    style: {
      base: {
        iconColor: '#111827',
        color: '#111827',
        fontSize: '16px',
        '::placeholder': { color: '#6b7280' }
      }
    }
  };

  constructor(private fb: FormBuilder,
    public validation: ValidationService,
    private legendsPricing: LegendsPricingService,
    private legendsMember: LegendsMemberService,
    protected alertService: AlertService,
    private token: TokenService,
    private hiveService: HiveService,
    private stripeService: StripeService,
    private router: Router) {
      this.signupForm.form = this.fb.group({
        memberId: [0],
        firstName: [''],
        lastName: [''],
        email: [''],
        phone: [''],
        sms: [''],
        password: [''],
        plan: ['', Validators.required],
        paymentMethodId: ['']
      });
  }

  ngOnInit(): void {
    this.loadPricing();
    // The upgrading member is the signed-in (free/expired/canceled) member, identified
    // by their JWT. Card data is tokenized client-side via Stripe Elements.
    this.legendsMember.getMember().subscribe({
      next: (data: any) => {
        const profile = data?.data;
        if (!profile) {
          this.validToken = false;
          return;
        }
        this.validToken = true;
        this.accountName = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim();
        this.accountEmail = profile.email;
        this.signupForm.form.patchValue({
          memberId: profile.memberId ?? 0,
          firstName: profile.firstName ?? '',
          lastName: profile.lastName ?? '',
          email: profile.email ?? '',
          phone: profile.phone ?? '',
          sms: !!profile.sms,
          password: profile.password ?? ''
        });
      },
      error: () => { this.validToken = false; }
    });
  }

  loadPricing() {
    this.legendsPricing.getProductPricing(environment.prodId).subscribe((data: any) => {
      this.plans = data.data;
    });
  }

  invalid(control: AbstractControl) {
    return (
      (!control.valid && control.touched) ||
      (!control.valid && control.untouched && this.signupForm.formSubmitAttempt)
    );
  }

  invalidCss(control: AbstractControl) {
    return {
      'is-invalid': this.invalid(control)
    };
  }

  changePlan($event: any) {
    let selectedPlan = $event.target.options[$event.target.selectedIndex].innerHTML;
    if ($event.target.value == "") {
      this.selectedPrice = "";
      this.selectedFrequency = "";
    } else {
      this.selectedPrice = selectedPlan.split('/')[0];
      this.selectedFrequency = selectedPlan.split('/')[1];
    }
  }

  onCardChange(event: any) {
    this.cardComplete = !!event?.complete;
    this.cardErrorMessage = event?.error?.message || '';
  }

  saveSignUp() {
    this.alertService.clear();
    this.signupForm.formSubmitAttempt = true;
    if (!this.signupForm.form.valid) {
      return;
    }
    if (!this.cardComplete) {
      this.alertService.error('Error', this.cardErrorMessage || 'Please complete your card details, including ZIP/postal code.', this.alertOptions);
      return;
    }

    this.processingSignup = true;
    // Tokenize the card client-side; the server never sees raw card data.
    this.stripeService.createPaymentMethod({ type: 'card', card: this.card.element }).subscribe((p: any) => {
      if (p.error?.message) {
        this.processingSignup = false;
        this.cardErrorMessage = p.error.message;
        this.alertService.error('Error', p.error.message, this.alertOptions);
        return;
      }
      this.signupForm.form.patchValue({ paymentMethodId: p.paymentMethod?.id });

      this.legendsMember.resubscribe(this.signupForm.form.value).subscribe({
        next: (data: any) => {
          if (data.error) {
            this.alertService.error('Error', data.msg, this.alertOptions);
            setTimeout(() => { this.processingSignup = false; }, 400);
          } else {
            if (data?.data) {
              this.token.set(data.data);
              this.token.isValid(true);
            }
            void this.hiveService.sendMemberDataToHive(data?.data || {
              email: this.signupForm.form.value.email,
              firstName: this.signupForm.form.value.firstName,
              lastName: this.signupForm.form.value.lastName,
            }).catch((error) => {
              console.warn('Unable to send upgrade signup event to Hive.', error);
            });
            this.confirmation = data.msg || 'Welcome to Top Grillin\'!  Your subscription is now active.';
            this.submitted = true;
          }
        },
        error: (err) => {
          this.processingSignup = false;
          this.alertService.error('Error', err?.error?.message || err?.message || 'Something went wrong!', this.alertOptions);
        }
      });
    });
  }

}
