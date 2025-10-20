import { Component, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  imports: [CommonModule],
  template: `
    <input
      type="text"
      placeholder="Keyword Search..."
      (input)="onSearch($event)"
      class="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  searchChange = output<string>();

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }
}
