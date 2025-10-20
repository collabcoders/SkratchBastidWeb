import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-newsletter',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsletterComponent {
  email = signal('');

  onSubscribe() {
    const emailValue = this.email();
    if (emailValue) {
      console.log('Newsletter subscription:', emailValue);
      // Add subscription logic here
    }
  }

  onEmailChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.email.set(target.value);
  }
}