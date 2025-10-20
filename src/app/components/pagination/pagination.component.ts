import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-1">
      <!-- Previous button -->
      <button
        (click)="previous()"
        [disabled]="currentPage() <= 1"
        class="px-3 py-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50"
      >
        ‹
      </button>

      <!-- Page numbers -->
      @for (page of getVisiblePages(); track page) {
      <button
        (click)="goToPage(page)"
        [class]="
          page === currentPage()
            ? 'px-3 py-2  bg-gray-600 text-white rounded '
            : 'px-3 py-2 bg-white text-black rounded hover:bg-gray-100'
        "
      >
        {{ page }}
      </button>
      }

      <!-- Next button -->
      <button
        (click)="next()"
        [disabled]="currentPage() >= totalPages()"
        class="px-3 py-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50"
      >
        ›
      </button>

      <!-- Total pages -->
      <span class="ml-2 text-white">{{ totalPages() }}</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  currentPage = input<number>(1);
  totalPages = input<number>(1);
  pageChange = output<number>();

  getVisiblePages(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];

    // Show first 6 pages if total > 6, otherwise show all
    if (total <= 6) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      for (let i = 1; i <= 6; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  goToPage(page: number) {
    if (page !== this.currentPage() && page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }

  previous() {
    if (this.currentPage() > 1) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  next() {
    if (this.currentPage() < this.totalPages()) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }
}
