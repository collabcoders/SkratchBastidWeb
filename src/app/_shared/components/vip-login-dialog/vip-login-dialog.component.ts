import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

declare const bootstrap: any;
declare const $: any;

@Component({
  selector: 'app-vip-login-dialog',
  imports: [],
  templateUrl: './vip-login-dialog.component.html',
  styleUrl: './vip-login-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class VipLoginDialogComponent {
  // Retry config mirrors HeaderComponent so we wait for the bootstrap/jQuery
  // modal library to be ready before giving up.
  private static readonly modalRetryDelay = 200;
  private static readonly modalRetryCount = 10;

  isVisible = input<boolean>(false);
  closeDialog = output<void>();

  onClose() {
    this.closeDialog.emit();
  }

  onMaybeLater() {
    this.closeDialog.emit();
  }

  // The login/register modals live globally in <app-forms>, so just open the
  // requested one in place — no router navigation. The /login and /join routes
  // both resolve to HomeComponent, so navigating there would yank the user off
  // the current page (e.g. a video detail) back to the home view, even though
  // the auth modal still opens on top.
  onSignIn() {
    this.openAuthModal('loginModal');
    this.closeDialog.emit();
  }

  onJoinVip() {
    this.openAuthModal('registerModal');
    this.closeDialog.emit();
  }

  onBackdropClick(event: MouseEvent) {
    // Close dialog when clicking on backdrop (outside the modal content)
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  private openAuthModal(modalId: 'loginModal' | 'registerModal') {
    setTimeout(() => this.showModal(modalId), 0);
  }

  private showModal(modalId: string, retries = VipLoginDialogComponent.modalRetryCount) {
    const modalEl = document.getElementById(modalId);
    if (!modalEl) {
      if (retries > 0) {
        setTimeout(() => this.showModal(modalId, retries - 1), VipLoginDialogComponent.modalRetryDelay);
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
      setTimeout(() => this.showModal(modalId, retries - 1), VipLoginDialogComponent.modalRetryDelay);
    }
  }
}
