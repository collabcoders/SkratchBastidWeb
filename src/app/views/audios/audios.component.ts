import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { FreeTrialFormComponent } from '../../components/free-trial-form/free-trial-form.component';
import { SearchComponent } from '../../components/search/search.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ApiService } from '@shared/services/api.service';
import { AlertService } from '@shared/services/alert.service';
import { Config } from '@shared/config';
import { AudioPlayerBarComponent } from 'src/app/components/audio-player-bar/audio-player-bar.component';
import { environment } from '@env/environment';
import { Music } from '@shared/models/music';
import { AudioService } from '@shared/services/audio.service';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { Category } from '@shared/models/category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audios',
  imports: [
    HeaderComponent,
    FooterComponent,
    FreeTrialFormComponent,
    AudioPlayerBarComponent,
    SearchComponent,
    PaginationComponent,
    ImagePipe,
    CommonModule,
  ],
  templateUrl: './audios.component.html',
  styleUrl: './audios.component.scss',
})
export class AudiosComponent implements OnInit {
  categories: string[] = ['All'];
  categoryValues: string[] = ['all'];
  selectedCategory = 'All';
  searchQuery = '';
  currentPage = 1;
  itemsPerPage = 24;
  totalPages = 1;

  allMusic: Music[] = [];

  isLoadingMusic: WritableSignal<boolean> = signal(true);
  isLoadingCategory: WritableSignal<boolean> = signal(false);

  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    public audioService: AudioService,
  ) {}

  ngOnInit(): void {
    if (environment.ismock) {
      this.loadMockAudio();
    } else {
      this.loadCategories();
    }
  }

  private loadCategories(): void {
    this.isLoadingCategory.set(true);
    this.apiService.getData('categories', 'music', '', `${environment.projectid}`).subscribe({
      next: (data: any) => {
        const categories = (data?.data as Category[]) || [];
        this.categories = ['All', ...categories.map((c) => c.name)];
        this.categoryValues = ['all', ...categories.map((c) => c.value)];
        this.isLoadingCategory.set(false);
        this.selectCategory('All');
      },
      error: (err) => {
        this.isLoadingCategory.set(false);
        this.alertService.error('', err?.error?.message || err?.message || 'Failed to load categories', Config.alertOptions);
        this.selectCategory('All');
      },
    });
  }

  private loadMockAudio(): void {
    this.isLoadingMusic.set(true);
    this.apiService.getSectionData('audio').subscribe({
      next: (data) => {
        this.allMusic = data?.data || [];
        const uniqueCats = Array.from(
          new Set(this.allMusic.map((d: Music) => d.category).filter((cat) => !!cat)),
        );
        this.categories = ['All', ...uniqueCats];
        this.categoryValues = ['all', ...uniqueCats.map((c) => c.toLowerCase())];
        this.isLoadingMusic.set(false);
        this.updatePagination();
      },
      error: (err) => {
        this.isLoadingMusic.set(false);
        this.alertService.error('', err?.error?.message || err?.message || 'Failed to load audio', Config.alertOptions);
      },
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.searchQuery = '';

    if (environment.ismock) {
      this.updatePagination();
      return;
    }

    this.isLoadingMusic.set(true);
    const catValue = (this.categoryValues[this.categories.indexOf(category)] || 'all').toLowerCase();
    const query = catValue === 'all'
      ? ''
      : `${catValue}&client=hls&sort=date&dir=desc`;
    this.apiService
      .getData('music', query, '')
      .subscribe({
        next: (data: any) => {
          this.allMusic = data?.data || [];
          this.isLoadingMusic.set(false);
          this.updatePagination();
        },
        error: (err) => {
          this.isLoadingMusic.set(false);
          this.alertService.error('', err?.error?.message || err?.message || 'Failed to load music', Config.alertOptions);
        },
      });
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
    this.updatePagination();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  isAudioFile(url: string): boolean {
    return url?.endsWith('.mp3') || url?.endsWith('.wav') || url?.endsWith('.m4a') || url?.endsWith('.ogg');
  }

  playAudio(mix: Music, event: Event): void {
    if (this.isAudioFile(mix.file)) {
      event.preventDefault();
      event.stopPropagation();
      this.audioService.playTrack(mix);
    }
  }

  isCurrentTrack(mix: Music): boolean {
    return this.audioService.currentTrack()?.file === mix.file;
  }

  onImageLoad(event: Event) {
    const target = event.target as HTMLElement | null;
    if (target && 'classList' in target) {
      target.classList.remove('blur-preview', 'shimmer');
    }
  }

  onImageError(event: Event) {
    const target = event.target as HTMLElement | null;
    if (target && 'classList' in target) {
      target.classList.remove('blur-preview', 'shimmer');
    }
  }

  getCategoryMusic(): Music[] {
    if (this.selectedCategory === 'All') {
      return this.allMusic;
    }

    const catValue = (this.categoryValues[this.categories.indexOf(this.selectedCategory)] || '').toLowerCase();
    return this.allMusic.filter(
      (track) => track.category?.toLowerCase() === catValue || track.category?.toLowerCase() === this.selectedCategory.toLowerCase(),
    );
  }

  getSearchFilteredMusic(): Music[] {
    const categoryMusic = this.getCategoryMusic();

    if (!this.searchQuery.trim()) {
      return categoryMusic;
    }

    const query = this.searchQuery.toLowerCase();
    return categoryMusic.filter((track) =>
      (track.title || '').toLowerCase().includes(query) ||
      (track.artist || '').toLowerCase().includes(query) ||
      (track.description || '').toLowerCase().includes(query),
    );
  }

  getCurrentPageMusic(): Music[] {
    const filtered = this.getSearchFilteredMusic();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }

  updatePagination(): void {
    const totalMusic = this.getSearchFilteredMusic().length;
    this.totalPages = Math.max(1, Math.ceil(totalMusic / this.itemsPerPage));
  }
}
