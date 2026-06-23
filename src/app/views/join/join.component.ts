import { Component, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FreeTrialFormComponent, FreeTrialFormData } from '../../components/free-trial-form/free-trial-form.component';

interface VIPFeature {
  text: string;
}

@Component({
  selector: 'app-join',
  imports: [FormsModule, HeaderComponent, FooterComponent, FreeTrialFormComponent],
  templateUrl: './join.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './join.component.scss',
})
export class JoinComponent {
  newsletterEmail = '';
  currentUrl = '';
  loginUrl = '/login';

  vipFeatures: VIPFeature[] = [
    { text: 'Free features.' },
    { text: 'Stream over 2,000 hours of exclusive DJ sets.' },
    { text: 'VIP-only streams.' },
    { text: 'Discord Server.' },
    { text: 'Pre-sale and first access to new merch drops.' },
    { text: '10% off entire online store.' },
  ];

  constructor(private router: Router) {
    this.currentUrl = this.router.url || '/';
    this.loginUrl = `/login?returnUrl=${encodeURIComponent(this.currentUrl)}`;
  }

  onSignupSubmit(formData: FreeTrialFormData) {
    console.log('Signup submitted:', formData);
  }
}
