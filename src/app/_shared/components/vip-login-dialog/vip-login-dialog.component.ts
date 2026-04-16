import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vip-login-dialog',
  imports: [CommonModule],
  templateUrl: './vip-login-dialog.component.html',
  styleUrl: './vip-login-dialog.component.scss',
  standalone: true,
})
export class VipLoginDialogComponent {
  isVisible = input<boolean>(false);
  closeDialog = output<void>();

  constructor(private router: Router) {}

  onClose() {
    this.closeDialog.emit();
  }

  onMaybeLater() {
    this.closeDialog.emit();
  }

  onSignIn() {
    this.router.navigate(['/login'], {
      queryParams: {
        returnUrl: this.router.url,
      },
    });
    this.closeDialog.emit();
  }

  onJoinVip() {
    this.router.navigate(['/join']);
    this.closeDialog.emit();
  }

  onBackdropClick(event: MouseEvent) {
    // Close dialog when clicking on backdrop (outside the modal content)
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
