import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HiveService } from '@shared/services/hive.service';

@Component({
  selector: 'app-bbq-signup-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './bbq-signup-form.component.html',
  styleUrl: './bbq-signup-form.component.scss',
})
export class BBQSignupFormComponent implements AfterViewInit {
  private readonly hiveInitId = 133267;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  formData = {
    name: '',
    email: '',
    phone: '',
    city: '',
    zip: '',
  };

  constructor(private hiveService: HiveService) {}

  cities = [
    'Toronto',
    'Vancouver',
    'NYC',
    'LA',
    'Austin',
    'Montreal',
    'Ottawa',
    'Miami',
    'Winnipeg',
    'Edmonton',
    'Other'
  ];

  async ngAfterViewInit() {
    try {
      await this.hiveService.ensureInitialized(this.hiveInitId);
    } catch (error) {
      console.warn('Unable to initialize Hive SDK for BBQ signup form.', error);
    }
  }

  async onSubmit() {
    console.log('BBQ Signup Form submitted:', this.formData);
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.formData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    this.isSubmitting = true;

    try {
      await this.hiveService.ensureInitialized(this.hiveInitId);
      await this.hiveService.sendToHive(this.formData);
      this.successMessage = "You're successfully signed up!";
    } catch (error) {
      console.error('Error sending data to Hive:', error);
      this.errorMessage = 'Something went wrong. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
