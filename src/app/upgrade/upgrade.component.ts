import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { FormValidator } from '@shared/models/form-validator';
import { AlertService } from '@shared/services/alert.service';
import { ApiService } from '@shared/services/api.service';
import { TokenService } from '@shared/services/token.service';
import { ValidationService } from '@shared/services/validation.service';
import * as countriesJson from '@data/countries.json';
import { Config } from '@shared/config';
import { Profile } from '@shared/models/profile';

@Component({
  selector: 'app-upgrade',
  standalone: false,
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})

export class UpgradeComponent implements OnInit {
  signupForm: FormValidator = {} as any;
  plans: any = [];
  accountEmail = '';
  accountName = '';
  alert: any = [];
  alertOptions = {
    autoClose: true,
    keepAfterRouteChange: false
  };
  countries: any = (countriesJson as any).default;
  selectedPrice = "";
  selectedFrequency = "";
  processingSignup = false;
  source = 'website';
  submitted = false;
  confirmation = '';
  validToken = false;

  constructor(private fb: FormBuilder,
    public validation: ValidationService,
    private api: ApiService,
    protected alertService: AlertService,
    private token: TokenService) {
      this.signupForm.form = this.fb.group({
        memberId: [0],
        firstName: [''],
        lastName: [''],
        email: [''],
        phone: [''],
        sms: [''],
        password: [''],
        address1: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required],
        zip: [null, Validators.required],
        country: ["", Validators.required],
        customerId: [""],
        plan: ["", Validators.required],
        cc: [null, Validators.compose([Validators.required, this.validation.creditCardValidator])],
        ccMo: [null, Validators.compose([Validators.required, this.validation.twoDigitMonthValidator])],
        ccYr: [null, Validators.compose([Validators.required, this.validation.twoDigitYearValidator])],
        cvc: [null, Validators.compose([Validators.required, this.validation.creditCardCvvValidator])]
      });
     }

  ngOnInit(): void {
    this.loadPricing();
    const url = window.location.href;
    let _token = url.substr(url.lastIndexOf('/') + 1);
    if (_token.toLowerCase().substring(0, 1) == 'i') {
      this.source = "iphone";
    }
    if (_token.toLowerCase().substring(0, 1) == 'a') {
      this.source = "android";
    }
    _token = _token.substring(1);
    const memberId = Number(_token.slice(5, _token.indexOf("m")));
    if (memberId > 0) {
      this.validToken = true;
    }
    console.log(_token);
    this.api.getItem('members', memberId, '', false).subscribe((data: any) => {
      const profile = data.data as Profile;
      this.accountName = profile.firstName + ' ' + profile.lastName;
      this.accountEmail = profile.email;
      this.createSignUp(profile);
    });
  }

  loadPricing() {
    this.api.getData(environment.api + '/api/App/ProductPricing', '', '&prodId=prod_KJzROZ43ZF7aYS').subscribe((data: any) => {
      this.plans = data.data;
    });
  }

  createSignUp(mem: Profile) {
  //   this.signupForm.form = new FormGroup({
  //     firstName: new FormControl(mem.firstName),
  //     lastName: new FormControl(mem.lastName),
  //     email: new FormControl(mem.email),
  //     phone: new FormControl(mem.phone),
  //     sms: new FormControl(mem.sms),
  //     password: new FormControl(mem.password),
  //     address1: new FormControl(null, Validators.required),
  //     city: new FormControl(null, Validators.required),
  //     state: new FormControl(null, Validators.required),
  //     zip: new FormControl(null, Validators.required),
  //     country: new FormControl("", Validators.required),
  //     customerId: new FormControl(""),
  //     plan: new FormControl("", Validators.required),
  //     cc: new FormControl(null, Validators.compose([Validators.required, this.validation.creditCardValidator])),
  //     ccMo: new FormControl(null, Validators.compose([Validators.required, this.validation.twoDigitMonthValidator])),
  //     ccYr: new FormControl(null, Validators.compose([Validators.required, this.validation.twoDigitYearValidator])),
  //     cvc: new FormControl(null, Validators.compose([Validators.required, this.validation.creditCardCvvValidator]))
  // });
    this.signupForm.form = this.fb.group({
      memberId: [mem.memberId],
      firstName: [mem.firstName],
      lastName: [mem.lastName],
      email: [mem.email],
      phone: [mem.phone],
      sms: [mem.sms],
      password: [mem.password],
      address1: [null, Validators.required],
      city: [null, Validators.required],
      state: [null, Validators.required],
      zip: [null, Validators.required],
      country: ["", Validators.required],
      customerId: [""],
      plan: ["", Validators.required],
      cc: [null, Validators.compose([Validators.required, this.validation.creditCardValidator])],
      ccMo: [null, Validators.compose([Validators.required, this.validation.twoDigitMonthValidator])],
      ccYr: [null, Validators.compose([Validators.required, this.validation.twoDigitYearValidator])],
      cvc: [null, Validators.compose([Validators.required, this.validation.creditCardCvvValidator])]
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

  saveSignUp() {
    this.alertService.clear();
    this.signupForm.formSubmitAttempt = true;
    //console.log(this.signupForm.form.value);
    if (this.signupForm.form.valid) {
      this.processingSignup = true;
      this.api.post('UpdateSubscription?app=' + Config.app + '&source=' + this.source, this.signupForm.form.value, true, true)
        .subscribe(data => {
          if (data.error) {
            // SHOW ERROR MESSAGE
            console.log(data);
            this.alertService.error('Error', data.msg, this.alertOptions)
            setTimeout(() => {
              this.processingSignup = false;
            }, 400);
          } else {
            // SET TOKEN
            console.log(data);
            this.token.set(data.data);
            //this.logIn.emit();
            // SHOW MESSAGES AND REDIRECT
            this.confirmation = data.msg;
            setTimeout(() => {
              this.submitted = true;
              this.confirmation = data.msg;
            //this.processingSignup = false;
            }, 400);
          }
        });
    }
  }

}
