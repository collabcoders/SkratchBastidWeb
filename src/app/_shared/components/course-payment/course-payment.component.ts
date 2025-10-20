import { FormValidator } from '@shared/models/form-validator';
import { DatePipe } from '@angular/common'
import { Profile } from '@shared/models/profile';
import { UploaderService } from '@shared/services/uploader.service';
import { AlertService } from '@shared/services/alert.service';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ValidationService } from '@shared/services/validation.service';
import { ApiService } from '@shared/services/api.service';
import { TokenService } from '@shared/services/token.service';
import { Config } from '@shared/config';
import { AudioService } from '@shared/services/audio.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as countriesJson from '@data/countries.json';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-course-payment',
  templateUrl: './course-payment.component.html',
  standalone: false,
  styleUrls: ['./course-payment.component.scss']
})
export class CoursePaymentComponent implements OnInit {
  purchaseForm: FormValidator = {} as any;
  alert: any = [];
  memberProfile!: Profile;
  processingPurchase = false;
  countries: any = (countriesJson as any).default;
  @Output("isClose") isClose: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder,
    public validation: ValidationService,
    private api: ApiService,
    protected alertService: AlertService,
    private token: TokenService,
    private uploader: UploaderService,
    public datePipe: DatePipe,
    private audioService: AudioService,
    private sanitizer: DomSanitizer) {
      this.createPurchase();
    }

  ngOnInit(): void {
    $('#courseModal').on('hidden.bs.modal', () => {
      console.log("CLOSE a VIDEO");
      this.isClose.next(this.paymentSuccess);
    });
  }

  createPurchase() {
    const member = this.token.getMember();
    this.purchaseForm.form = this.fb.group({
      memberId: [member?.memberId],
      // customerId: [member?.customerId],
      firstName: [member?.firstName, Validators.required],
      lastName: [member?.lastName, Validators.required],
      address1: [null, Validators.required],
      city: [null, Validators.required],
      state: [null, Validators.required],
      zip: [null, Validators.required],
      country: ["", Validators.required],
      cc: [null, Validators.compose([Validators.required, this.validation.creditCardValidator])],
      ccMo: [null, Validators.compose([Validators.required, this.validation.twoDigitMonthValidator])],
      ccYr: [null, Validators.compose([Validators.required, this.validation.twoDigitYearValidator])],
      cvc: [null, Validators.compose([Validators.required, this.validation.creditCardCvvValidator])]
    });

    // this.purchaseForm.form.get('firstName')?.disable();
    // this.purchaseForm.form.get('lastName')?.disable();
  }

  invalid(control: AbstractControl) {
    if (control === undefined || control == null || typeof control === 'undefined') {
      return false;
    } else {
      return (
        (!control.valid && control.touched) ||
        (!control.valid && control.untouched && this.purchaseForm.formSubmitAttempt)
      );
    }
  }

  invalidCss(control: AbstractControl) {
    if (control === undefined || control == null || typeof control === 'undefined') {
      return {
        'is-invalid': false
      };
    } else {
      return {
        'is-invalid': this.invalid(control)
      };
    }
  }

  getBase64(url: string, callback: (q: any) => void) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
      reader.onerror = function (error) {
        console.log('Error: ', error);
        return '';
      };
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  paymentSuccess = false;
  purchase() {
    this.alertService.clear();
    this.purchaseForm.formSubmitAttempt = true;
    if (this.purchaseForm.form.valid) {
      this.processingPurchase = true;
      this.purchaseForm.form.get('firstName')?.enable();
      this.purchaseForm.form.get('lastName')?.enable();
      const member = this.token.getMember();
      this.purchaseForm.form.get('firstName')?.setValue(member?.firstName);
      this.purchaseForm.form.get('lastName')?.setValue(member?.lastName);
      let endpoint = 'NewPurchase';
      this.api.post(endpoint + '?app=' + Config.app, this.purchaseForm.form.value, true, true)
        .subscribe(data => {
          if (data.error) {
            // SHOW ERROR MESSAGE
            console.log(data);
            this.purchaseForm.form.get('firstName')?.disable();
            this.purchaseForm.form.get('lastName')?.disable();
            this.alertService.error('Error', data.msg, Config.alertOptions)
            setTimeout(() => {
              this.processingPurchase = false;
            }, 400);
          } else {
            // SET TOKEN
            console.log(data);
            this.token.set(data?.data);
            this.paymentSuccess = true;
            $('#courseModal').modal('hide');
            // SHOW MESSAGES AND REDIRECT
            bootbox.alert('<h4>Purchase Success</h4><br>' + data.msg);
            setTimeout(() => window.location.reload(), 1000);
            setTimeout(() => {
              this.processingPurchase = false;
            }, 400);
          }
        });
    }
  }

  dismissPurchase(e: any) {
    e.preventDefault();
    $('#courseModal').modal('show');
  }
}
