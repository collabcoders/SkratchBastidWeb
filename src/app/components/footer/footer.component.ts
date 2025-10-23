import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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
  constructor() {
  }

  newsletterEmail = signal('');

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
  ];

  pageLinksColumn2: FooterLink[] = [
    {
      label: 'Brand Partnerships',
      href: 'mailto:management@skratchbastid.com',
      external: true,
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
}
