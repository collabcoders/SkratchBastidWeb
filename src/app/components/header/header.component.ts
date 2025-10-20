import { Component, inject, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface NavLink {
  label: string;
  href: string;
  hoverColor: string;
  color: string;
  hoverImage?: string;
  external?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  private router = inject(Router);

  // mobile menu state
  mobileMenuOpen: boolean = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.updateBodyScroll();
    if (this.mobileMenuOpen) {
      // focus the drawer for accessibility so Escape key and tabbing work
      setTimeout(() => {
        const drawer = document.querySelector('.sb-drawer') as HTMLElement | null;
        if (drawer) drawer.focus();
      }, 50);
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    this.updateBodyScroll();
  }

  // handle overlay click
  onOverlayClick(event: MouseEvent) {
    // only close if clicked on overlay (not the drawer)
    if ((event.target as HTMLElement).classList.contains('sb-overlay')) {
      this.closeMobileMenu();
    }
  }

  // lock/unlock body scroll when menu opens/closes
  private updateBodyScroll() {
    if (this.mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  // close on Escape
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onWindowKeydown(event: KeyboardEvent) {
    this.handleKeydown(event);
  }

  ngOnDestroy(): void {
    // ensure body scroll unlocked
    document.body.style.overflow = '';
  }

  isActive(href: string): boolean {
    if (href.startsWith('http')) return false; // External links
    return this.router.url === href;
  }

  getActiveColor(hoverColor: string): string {
    return hoverColor.replace('hover:', '');
  }

  navLinks: NavLink[] = [
    {
      label: 'Videos',
      href: '/videos',
      hoverColor: 'hover:text-[#F39301]',
      color: '#F39301',
      hoverImage: '/img/imgHover/videosHover.png',
    },
    {
      label: 'Audio',
      href: '/audios',
      hoverColor: 'hover:text-[#FF95BC]',
      color: '#FF95BC',
      hoverImage: '/img/imgHover/audioHover.png',
    },
    {
      label: 'Events',
      href: '/events',
      hoverColor: 'hover:text-[#85C441]',
      color: '#85C441',
      hoverImage: '/img/imgHover/eventsHover.png',
    },
    {
      label: "Top Grillin'",
      href: '/topgrillin',
      hoverColor: 'hover:text-[#EFDA11]',
      color: '#EFDA11',
      hoverImage: '/img/imgHover/topgrillinHover.png',
    },
    {
      label: "BASTID'S BBQ",
      href: '/bastidbbq',
      hoverColor: 'hover:text-[#1F85FF]',
      color: '#1F85FF',
      hoverImage: '/img/imgHover/bbqfestivalHover.png',
    },
    {
      label: 'Shop',
      href: 'https://shop.skratchbastid.com/',
      hoverColor: 'hover:text-[#D4582D]',
      color: '#D4582D',
      hoverImage: '/img/imgHover/shopHover.png',
      external: true,
    },
  ];

  mobileAuthLinks: NavLink[] = [
    {
      label: 'Sign Up',
      href: '/join',
      hoverColor: '#D4582D',
      color: '#D4582D',
    },
    {
      label: 'Login',
      href: '/login',
      hoverColor: '#D4582D',
      color: '#D4582D',
    },
  ];
}
