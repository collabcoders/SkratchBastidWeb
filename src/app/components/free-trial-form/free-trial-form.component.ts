import { AfterViewInit, Component, ElementRef, ViewChild, input, output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppData } from 'src/app/app.data';
import { Observable } from 'rxjs';
import { TokenService } from '@shared/services/token.service';
import { HiveService } from '@shared/services/hive.service';

export interface FreeTrialFormData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-free-trial-form',
  imports: [FormsModule],
  templateUrl: './free-trial-form.component.html',
  styleUrl: './free-trial-form.component.scss',
})
export class FreeTrialFormComponent implements AfterViewInit {
  // Inputs for customization
  containerClasses = input<string>('bg-white relative overflow-hidden py-8 px-6 max-w-md mx-auto');
  showTopMargin = input<boolean>(false);

  // Form data
  email = '';
  firstName = '';
  lastName = '';
  phoneNumber = '';
  password = '';
  confirmPassword = '';
  isSubmitting = false;
  hiveInitId = 133267;

  // Output for form submission
  formSubmit = output<FreeTrialFormData>();
  @ViewChild('hiveForm') hiveForm?: ElementRef<HTMLFormElement>;

  isLoggedIn$!: Observable<boolean>;
  constructor(
    private router: Router,
    private appData: AppData,
    private token: TokenService,
    private hiveService: HiveService,
  ) {
    if (!this.isLoggedIn$) this.isLoggedIn$ = this.token.isValid(undefined);
  }

  async ngAfterViewInit() {
    try {
      await this.hiveService.ensureInitialized(this.hiveInitId);
      console.log('HIVE_SDK loaded and initialized');
    } catch (error) {
      console.warn('Unable to initialize Hive SDK.', error);
    }
  }

  async onSubmit() {
    this.isSubmitting = true;

    try {
      await this.hiveService.ensureInitialized(this.hiveInitId);

      if (!this.hiveForm?.nativeElement) {
        throw new Error('Form reference not found');
      }

      await this.hiveService.sendToHiveCTA(this.hiveForm.nativeElement);

      this.formSubmit.emit({
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        phoneNumber: this.phoneNumber,
        password: this.password,
        confirmPassword: this.confirmPassword,
      });
    } catch (err) {
      console.error('Error submitting form via Hive SDK:', err);
      alert('Something went wrong. Please try again later.');
    } finally {
      this.isSubmitting = false;
    }
  }

  openSignup() {
    this.appData.planOpen.set('free');
    this.router.navigate(['/join']);
  }
}
