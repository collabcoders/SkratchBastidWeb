import { AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HiveService } from '@shared/services/hive.service';
import { Config } from '@shared/config';

@Component({
  selector: 'app-bbq-signup-form',
  imports: [FormsModule],
  templateUrl: './bbq-signup-form.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './bbq-signup-form.component.scss',
})
export class BBQSignupFormComponent implements AfterViewInit {
  readonly hiveInitId = Config.hiveSwid;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  formData = {
    name: '',
    email: '',
    phone: '',
    city: '',
    zip: '',
    consent: false,
  };

  @ViewChild('bbqVideo') bbqVideoRef?: ElementRef<HTMLVideoElement>;
  @ViewChildren('reveal') revealItems!: QueryList<ElementRef>;

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
    // Force muted autoplay — Angular only sets the `muted` attribute, not the
    // property, so Chrome's autoplay policy can block playback on a fresh load.
    const video = this.bbqVideoRef?.nativeElement;
    if (video) {
      video.muted = true;
      const tryPlay = () => video.play().catch(() => {});
      tryPlay();
      video.addEventListener('canplay', tryPlay, { once: true });
    }

    // Reveal the title/video and each form item as the form scrolls into view,
    // staggered via each element's CSS transition-delay.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    this.revealItems?.forEach((el) => observer.observe(el.nativeElement));

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
