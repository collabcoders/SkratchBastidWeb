import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { HiveService } from '@shared/services/hive.service';
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

  constructor(private hiveService: HiveService, private alertService: AlertService) {}

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
  async subscribeNewsletter() {
    const email = this.newsletterEmail();
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.alertService.error('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    this.isLoadingNewsletter.set(true);
    try {
      // skratchbastid newsletter goes to Hive (djjazzyjeff uses MailChimp).
      await this.hiveService.ensureInitialized(Config.hiveSwid);
      await this.hiveService.sendEmailSignup(email);
      this.alertService.success('Thank you for subscribing!', '');
    } catch (error) {
      this.alertService.error('', 'Something went wrong. Please try again.');
    } finally {
      this.newsletterEmail.set('');
      this.isLoadingNewsletter.set(false);
    }
  }
}