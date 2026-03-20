import { Component, inject, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, filter } from 'rxjs';
import { TokenService } from '@shared/services/token.service';
import { AlertService } from '@shared/services/alert.service';
import { FavoritesService } from '@shared/services/favorites.service';

interface NavLink {
  label: string;
  href: string;
  hoverColor: string;
  color: string;
  hoverImage?: string;
  external?: boolean;
}

declare const bootstrap: any;
declare const $: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy, OnInit {
  private static readonly desktopBreakpoint = 1280;
  private static readonly modalRetryDelay = 200;
  private static readonly modalRetryCount = 10;
  accountMenuOpen: boolean = false;
  private readonly subscriptions = new Subscription();

  toggleAccountMenu() {
    this.accountMenuOpen = !this.accountMenuOpen;
  }
  private router = inject(Router);

  // mobile menu state
  mobileMenuOpen: boolean = false;
  isLoggedIn$!: Observable<boolean>;

  alertOptions = {
    autoClose: true,
    keepAfterRouteChange: false
  };

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

  constructor(private token: TokenService, private alertService: AlertService, 
      private favoritesService: FavoritesService) {

  }

  openEventsModal() {
    this.closeMobileMenu();
    this.showModal('upcomingEventsModal');
  }

  showFavorites() {
    this.favoritesService.showModal();
  }

  openProfileModal() {
    this.accountMenuOpen = false;
    this.closeMobileMenu();
    this.showModal('profileModal');
  }

  openLogin() {
    this.accountMenuOpen = false;
    this.closeMobileMenu();
    this.openAuthRoute('/login', 'loginModal');
  }

  openRegister() {
    this.accountMenuOpen = false;
    this.closeMobileMenu();
    this.openAuthRoute('/join', 'registerModal');
  }

  logout() {
    console.log('Logging out...');
    this.token.remove();
    this.isLoggedIn$ = this.token.isValid(false);
    this.alertService.info('Sign-Out Successful', 'You have been Signed-Out.', this.alertOptions);
    setTimeout(() => window.location.reload(), 1000);
  }
  ngOnInit() {
    this.isLoggedIn$ = this.token.isValid(undefined);
    this.subscriptions.add(this.isLoggedIn$.subscribe((res: boolean) => {
      if (res) {
        if (this.token.getMember().plan == 'free') {
          // this.isFree = true;
        }
      }
    }));

    this.subscriptions.add(
      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe(() => {
          this.accountMenuOpen = false;
          this.closeMobileMenu();
        })
    );

    this.handleViewportChange();
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

  @HostListener('window:resize')
  onWindowResize() {
    this.handleViewportChange();
  }

  private handleViewportChange() {
    if (window.innerWidth >= HeaderComponent.desktopBreakpoint) {
      this.closeMobileMenu();
    } else {
      this.accountMenuOpen = false;
    }
  }

  private openAuthRoute(route: '/login' | '/join', modalId: 'loginModal' | 'registerModal') {
    if (this.router.url === route) {
      setTimeout(() => this.showModal(modalId), 0);
      return;
    }

    this.router.navigate([route]);
  }

  private showModal(modalId: string, retries = HeaderComponent.modalRetryCount) {
    const modalEl = document.getElementById(modalId);
    if (!modalEl) {
      if (retries > 0) {
        setTimeout(() => this.showModal(modalId, retries - 1), HeaderComponent.modalRetryDelay);
      }
      return;
    }

    if (typeof bootstrap !== 'undefined' && bootstrap?.Modal) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl, {
        backdrop: 'static',
        keyboard: false,
      });
      modal.show();
      return;
    }

    if (typeof $ !== 'undefined' && typeof $.fn?.modal === 'function') {
      $('#' + modalId).modal('show');
      return;
    }

    if (retries > 0) {
      setTimeout(() => this.showModal(modalId, retries - 1), HeaderComponent.modalRetryDelay);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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

  get filteredNavLinks(): NavLink[] {
    const member = this.token.getMember();
    if (member?.status === 'current') {
      return this.navLinks.filter(link => link.href !== '/topgrillin');
    }
    return this.navLinks;
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
      label: 'Livestream',
      href: '/livestream',
      hoverColor: 'hover:text-[#00C2FF]',
      color: '#00C2FF',
      hoverImage: '/img/imgHover/livestreamHover.png',
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
