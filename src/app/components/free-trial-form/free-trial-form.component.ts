import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FreeTrialFormData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
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

  // Output for form submission
  formSubmit = output<FreeTrialFormData>();

  onSubmit() {
    this.formSubmit.emit({
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
    });
  }
}
