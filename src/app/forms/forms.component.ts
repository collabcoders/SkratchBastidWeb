import { Component, inject, signal, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
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
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsComponent implements AfterViewInit {
  public router = inject(Router);

  ngAfterViewInit() {
    // Listen for Bootstrap modal close events and navigate to '/'
    const modalIds = [
      'loginModal',
      'registerModal',
      'contactModal',
      'privacyModal',
      'cancelModal',
      'refundModal',
    ];
    modalIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('hidden.bs.modal', () => {
          this.router.navigate(['/']);
        });
      }
    });
  }
  constructor() {
    // Listen for router navigation to policy routes and open modal only on NavigationEnd
    this.router.events.subscribe((event: any) => {
      if (event?.constructor?.name === 'NavigationEnd' && event.url) {
        if (event.url.includes('/privacypolicy')) {
          setTimeout(() => this.openPrivacyModal(), 0);
        } else if (event.url.includes('/cancelpolicy')) {
          setTimeout(() => this.openCancelModal(), 0);
        } else if (event.url.includes('/refundpolicy')) {
          setTimeout(() => this.openRefundModal(), 0);
        } else if (event.url.includes('/contact')) {
          setTimeout(() => this.openContactModal(), 0);
        } else if (event.url.includes('/login')) {
          setTimeout(() => this.openLoginModal(), 0);
        } else if (event.url.includes('/join')) {
          setTimeout(() => this.openRegisterModal(), 0);
        }
      }
    });
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
