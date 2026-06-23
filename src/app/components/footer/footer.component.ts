import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Config } from '@shared/config';
import { HiveService } from '@shared/services/hive.service';
import { AlertService } from '@shared/services/alert.service';
import { NavigateService } from '@shared/services/navigate.service';
import { TokenService } from '@shared/services/token.service';
import { TooltipDirective } from '@shared/directives/tooltip.directive';

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
  imports: [FormsModule, RouterModule, TooltipDirective],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  constructor(private hiveService: HiveService, private alertService: AlertService, private nav: NavigateService, private token: TokenService) {
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

  get filteredPageLinksColumn1(): FooterLink[] {
    const member = this.token.getMember();
    if (member?.status === 'current') {
      return this.pageLinksColumn1.filter(link => link.href !== '/topgrillin');
    }
    return this.pageLinksColumn1;
  }

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

  private showModal(modalId: string, retries = 5) {
    const el = document.getElementById(modalId);
    if (!el) { return; }
    if (typeof bootstrap !== 'undefined') {
      const modal = bootstrap.Modal.getInstance(el) || new bootstrap.Modal(el);
      modal.show();
    } else if (typeof $ !== 'undefined') {
      $('#' + modalId).modal('show');
    } else if (retries > 0) {
      setTimeout(() => this.showModal(modalId, retries - 1), 200);
    }
  }

  openLoginModal() { this.showModal('loginModal'); }
  openRegisterModal() { this.showModal('registerModal'); }
  openContactModal() { this.showModal('contactModal'); }
  openPrivacyModal() { this.showModal('privacyModal'); }
  openCancelModal() { this.showModal('cancelModal'); }
  openRefundModal() { this.showModal('refundModal'); }

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
      this.alertService.error('', 'Something went wrong. Please try again.', Config.alertOptions);
    } finally {
      this.newsletterEmail.set('');
      this.isLoadingNewsletter.set(false);
    }
  }
}
