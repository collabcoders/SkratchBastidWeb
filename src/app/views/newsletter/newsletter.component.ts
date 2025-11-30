import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { ApiService } from '@shared/services/api.service';
import { AlertService } from '@shared/services/alert.service';
import { Config } from '@shared/config';

@Component({
  selector: 'app-newsletter',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsletterComponent {
  email = signal('');

  constructor(private apiService: ApiService, private alertService: AlertService) {}

  onSubscribe() {
    const emailValue = this.email();
    if (emailValue) {
      console.log('Newsletter subscription:', emailValue);
      // Add subscription logic here
    }
  }

  onEmailChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.newsletterEmail.set(target.value);
  }

  newsletterEmail = signal('');
  isLoadingNewsletter = signal(false);
  subscribeNewsletter() {
    const email = this.newsletterEmail();
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.alertService.error('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    this.isLoadingNewsletter.set(true);
    this.apiService.post('SubscribeNewsletter?app=' + Config.app, email, true, true)
      .subscribe(data => {
        if (data.error) {
          // Optionally handle error from API
        }
        this.alertService.success('Thank you for subscribing!', data.msg);
        this.newsletterEmail.set('');
        this.isLoadingNewsletter.set(false);
      }, (error) => {
        this.newsletterEmail.set('');
        this.isLoadingNewsletter.set(false);
      });
  }
}