import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Config } from '@shared/config';
import { ApiService } from '@shared/services/api.service';
import { AlertService } from '@shared/services/alert.service';
import { NavigateService } from '@shared/services/navigate.service';

declare var $: any;
declare var bootstrap: any;

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  action?: () => void;
}


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  constructor(private apiService: ApiService, private alertService: AlertService, private nav: NavigateService) {
  }

  newsletterEmail = signal('');

  get year() {
    return new Date().getFullYear();
  }
  
  socialLinks: FooterLink[] = [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/skratchbastid/',
      external: true,
    },
    {
      label: 'X',
      href: 'https://x.com/skratchbastid',
      external: true,
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@SkratchBastidTV',
      external: true,
    },
    {
      label: 'Mixcloud',
      href: 'https://www.mixcloud.com/skratchbastid/',
      external: true,
    },
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@skratchbastid',
      external: true,
    },
  ];

  pageLinksColumn1: FooterLink[] = [
    {
      label: 'Videos',
      href: '/videos',
    },
    {
      label: 'Audios',
      href: '/audios',
    },
    {
      label: 'Events',
      href: '/events',
    },
    {
      label: 'Top Grillin',
      href: '/topgrillin',
      external: false,
    },
    {
      label: "Bastid's BBQ",
      href: '/bastidbbq',
      external: false,
    },
    {
      label: 'Shop',
      href: 'https://shop.skratchbastid.com/',
      external: true,
    },
  ];

  pageLinksColumn2: FooterLink[] = [
    {
      label: 'Contact',
      href: 'javascript:;',
      action: () => this.openContactModal(),
    },
  ];

  accountLinks: FooterLink[] = [
    {
      label: 'Login',
      href: 'javascript:;',
      action: () => this.openLoginModal(),
    },
    {
      label: 'Register',
      href: 'javascript:;',
      action: () => this.openRegisterModal(),
    },
  ];

  legalLinks: FooterLink[] = [
    {
      label: 'Privacy Policy',
      href: 'javascript:;',
      action: () => this.openPrivacyModal(),
    },
    {
      label: 'Cancel Policy',
      href: 'javascript:;',
      action: () => this.openCancelModal(),
    },
    {
      label: 'Refund Policy',
      href: 'javascript:;',
      action: () => this.openRefundModal(),
    },
  ];

  triggerNav(event: any, target: string, offset: number = 0) {
    switch(target) {
      case 'facebook': {
        target = Config.facebook;
        break;
      }
      case 'youtube': {
        target = Config.youtube;
        break;
      }
      case 'spotify': {
        target = Config.spotify;
        break;
      }
      case 'mixcloud': {
        target = Config.mixcloud;
        break;
      }
      case 'soundcloud': {
        target = Config.soundcloud;
        break;
      }
      case 'twitter': {
        target = Config.twitter;
        break;
      }
      case 'twitch': {
        target = Config.twitch;
        break;
      }
      case 'tiktok': {
        target = Config.tiktok;
        break;
      }
      case 'tidal': {
        target = Config.tidal;
        break;
      }
      case 'cameo': {
        target = Config.cameo;
        break;
      }
      case 'applemusic': {
        target = Config.applemusic;
        break;
      }
      case 'bandcamp': {
        target = Config.bandcanp;
        break;
      }
      case 'discord': {
        target = Config.discord;
        break;
      }
      default: {
        target = Config.instagram;
        break;
      }
    }
    this.nav.goto(target, offset);
  }

  handleLinkClick(link: FooterLink) {
    // If the link is a policy route, open modal instead of navigating
    if (link.href === '/privacypolicy') {
      this.openPrivacyModal();
      return false;
    }
    if (link.href === '/cancelpolicy') {
      this.openCancelModal();
      return false;
    }
    if (link.href === '/refundpolicy') {
      this.openRefundModal();
      return false;
    }
    if (link.action) {
      link.action();
    }
    return true;
  }
  
  onNewsletterSubmit() {
    console.log('Newsletter signup:', this.newsletterEmail());
    // Implement newsletter signup logic
  }

  onNewsletterEmailChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.newsletterEmail.set(target.value);
  }

  openLoginModal() {
    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(document.getElementById('loginModal'));
      modal.show();
    } else if (typeof $ !== 'undefined') {
      $('#loginModal').modal('show');
    }
  }

  openRegisterModal() {
    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(document.getElementById('registerModal'));
      modal.show();
    } else if (typeof $ !== 'undefined') {
      $('#registerModal').modal('show');
    }
  }

  openContactModal() {
    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(document.getElementById('contactModal'));
      modal.show();
    } else if (typeof $ !== 'undefined') {
      $('#contactModal').modal('show');
    }
  }

  openPrivacyModal() {
    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(document.getElementById('privacyModal'));
      modal.show();
    } else if (typeof $ !== 'undefined') {
      $('#privacyModal').modal('show');
    }
  }

  openCancelModal() {
    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(document.getElementById('cancelModal'));
      modal.show();
    } else if (typeof $ !== 'undefined') {
      $('#cancelModal').modal('show');
    }
  }

  openRefundModal() {
    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(document.getElementById('refundModal'));
      modal.show();
    } else if (typeof $ !== 'undefined') {
      $('#refundModal').modal('show');
    }
  }

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
