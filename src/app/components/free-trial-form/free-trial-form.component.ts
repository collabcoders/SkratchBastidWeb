import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppData } from 'src/app/app.data';
import { Observable } from 'rxjs';
import { TokenService } from '@shared/services/token.service';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './free-trial-form.component.html',
  styleUrl: './free-trial-form.component.scss',
})
export class FreeTrialFormComponent {
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

  // Output for form submission
  formSubmit = output<FreeTrialFormData>();

  isLoggedIn$!: Observable<boolean>;
  constructor(private router: Router, private appData: AppData, private token: TokenService) {
    if (!this.isLoggedIn$) this.isLoggedIn$ = this.token.isValid(undefined);
  }

  onSubmit() {
    this.formSubmit.emit({
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      password: this.password,
      confirmPassword: this.confirmPassword,
    });
  }

  openSignup() {
    this.appData.planOpen.set('free');
    this.router.navigate(['/join']);
  }
}