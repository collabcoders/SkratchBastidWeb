import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppData } from 'src/app/app.data';

@Component({
  selector: 'app-bbq-signup-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './bbq-signup-form.component.html',
  styleUrl: './bbq-signup-form.component.scss',
})
export class BBQSignupFormComponent {
  formData = {
    fullName: '',
    email: '',
    phone: '',
    city: '',
    postalCode: ''
  };

  constructor(private router: Router, private appData: AppData) {}

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

  onSubmit() {
    console.log('BBQ Signup Form submitted:', this.formData);
    // Handle form submission logic here
  }

  openSignup() {
    this.appData.planOpen.set('free');
    this.router.navigate(['/join']);
  }
}