import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-pagination',
  imports: [],
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

      <!-- Page numbers (sliding window with ellipses) -->
      @for (item of getVisibleItems(); track $index) {
        @if (item === '...') {
          <span class="px-2 py-2 text-white select-none">…</span>
        } @else {
          <button
            (click)="goToPage(+item)"
            [class]="
              +item === currentPage()
                ? 'px-3 py-2  bg-gray-600 text-white rounded '
                : 'px-3 py-2 bg-white text-black rounded hover:bg-gray-100'
            "
          >
            {{ item }}
          </button>
        }
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

  /**
   * Sliding-window page list with first/last anchors and ellipses.
   * Shows up to ~7 numeric slots so users can see context around the
   * current page and jump to first/last quickly.
   *
   * Examples (totalPages, currentPage) -> output:
   *   (3, 2)   -> [1, 2, 3]
   *   (10, 1)  -> [1, 2, 3, 4, 5, '...', 10]
   *   (10, 5)  -> [1, '...', 4, 5, 6, '...', 10]
   *   (10, 10) -> [1, '...', 6, 7, 8, 9, 10]
   */
  getVisibleItems(): (number | '...')[] {
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const items: (number | '...')[] = [];
    const windowSize = 1; // pages on each side of current in the middle window

    // Always show page 1
    items.push(1);

    const leftEdge = Math.max(2, current - windowSize);
    const rightEdge = Math.min(total - 1, current + windowSize);

    if (leftEdge > 2) {
      items.push('...');
    }

    for (let i = leftEdge; i <= rightEdge; i++) {
      items.push(i);
    }

    if (rightEdge < total - 1) {
      items.push('...');
    }

    // Always show last page
    items.push(total);

    return items;
  }

  /**
   * Backwards-compat: keep the old method name in case anything external
   * relies on it. Returns just the numeric pages from getVisibleItems().
   */
  getVisiblePages(): number[] {
    return this.getVisibleItems().filter((x): x is number => x !== '...');
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
