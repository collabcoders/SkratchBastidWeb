import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FreeTrialFormComponent, FreeTrialFormData } from '../../components/free-trial-form/free-trial-form.component';

interface VIPFeature {
  text: string;
}

@Component({
  selector: 'app-join',
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, FreeTrialFormComponent],
  templateUrl: './join.component.html',
  styleUrl: './join.component.scss',
})
export class JoinComponent {
  newsletterEmail = '';

  vipFeatures: VIPFeature[] = [
    { text: 'Free features.' },
    { text: 'Stream over 2,000 hours of exclusive DJ sets.' },
    { text: 'VIP-only streams.' },
    { text: 'Discord Server.' },
    { text: 'Pre-sale and first access to new merch drops.' },
    { text: '10% off entire online store.' },
  ];

  onSignupSubmit(formData: FreeTrialFormData) {
    console.log('Signup submitted:', formData);
    // Add your signup logic here
  }
}
