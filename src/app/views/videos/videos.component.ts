import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FreeTrialFormComponent } from '../../components/free-trial-form/free-trial-form.component';
import { FooterComponent } from '../../components/footer/footer.component';
import {
  VideoCarouselComponent,
  VideoSection,
  VideoMix,
} from '../../components/video-carousel/video-carousel.component';
import {
  BBQRecapCarouselComponent,
  BBQRecapSection,
  BBQRecap,
} from '../../components/bbq-recap-carousel/bbq-recap-carousel.component';

import { VideoPlayerComponent } from '../../components/video-player/video-player.component';
import {
  RecordCarouselComponent,
  RecordSection,
} from '../../components/record-carousel/record-carousel.component';
import { SearchComponent } from '../../components/search/search.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ApiService } from '@shared/services/api.service';

@Component({
  imports: [
    CommonModule,
    HeaderComponent,
    FreeTrialFormComponent,
    FooterComponent,
    VideoCarouselComponent,
    BBQRecapCarouselComponent,
    RecordCarouselComponent,
    VideoPlayerComponent,
    SearchComponent,
    PaginationComponent,
  ],
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit {
  selectedCategory: string = 'All';
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;

  categories: string[] = ['All'];

  // Add missing properties referenced in template and methods
  topGrillinVideos: any[] = [
  ];

  tuesdayMorningCoffeeVideos: any[] = [];

  bbqRecaps: any[] = [];

  rotwRecords: any[] = [
  ];

  // Video sections for carousels
  topGrillinSection: VideoSection = {
    title: 'New in Top Grillin',
    icon: '/img/videosImg.png',
    data: [],
  };

  tuesdayMorningCoffeeSection: any = {
    title: 'Tuesday Morning Coffee',
    icon: '/img/videosImg.png',
    data: [
    ],
  };

  simpleBBQSection: BBQRecapSection = {
    title: 'BBQ Recaps',
    icon: '/img/videosImg.png',
    data: [],
  };

  simpleRecordSection: RecordSection = {
    title: 'Record of the Week',
    icon: '/img/videosImg.png',
    data: [],
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getSectionData('category').subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.categories = ['All', ...data];
        } else if (data && Array.isArray(data.data)) {
          this.categories = ['All', ...data.data];
        }
      },
      error: (err) => {
        console.error('Failed to fetch categories', err);
      }
    });

    this.apiService.getSectionData('video').subscribe({
      next: (data) => {
        this.topGrillinSection.data = data?.data?.filter((i: any) => i.category === 'Top Grillin') || [];
        this.tuesdayMorningCoffeeSection.data = data?.data?.filter((i: any) => i.title.includes('Tuesday Morning Coffee')) || [];
        this.topGrillinVideos = data?.data?.filter((i: any) => i.summary) || [];
        this.tuesdayMorningCoffeeVideos = data?.data?.filter((i: any) => i.title.includes('Tuesday Morning Coffee')) || [];
        console.log('Fetched videos:', this.topGrillinVideos);
      },
      error: (err) => {
        console.error('Failed to fetch categories', err);
      }
    });

    this.apiService.getSectionData('recap').subscribe({
      next: (data) => {
        this.bbqRecaps = data?.data?.filter((i: any) => i.summary && i?.category === 'bbq') || [];
        this.rotwRecords = data?.data?.filter((i: any) => i.summary && i?.category === 'rotw') || [];
        this.simpleBBQSection.data = data?.data?.filter((i: any) => !i.summary && i?.category === 'bbq') || [];
        this.simpleRecordSection.data = data?.data?.filter((i: any) => !i.summary && i?.category === 'rotw') || [];
        console.log('Fetched BBQ recaps:', this.bbqRecaps);
      },
      error: (err) => {
        console.error('Failed to fetch categories', err);
      }
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1; // Reset to first page when category changes
    this.searchQuery = ''; // Clear search when category changes
    this.updatePagination();
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1; // Reset to first page when search changes
    this.updatePagination();
    console.log('Search query:', query);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    console.log('Page changed to:', page);
  }

  // Get all videos for the selected category (before search filtering)
  getCategoryVideos() {
    switch (this.selectedCategory) {
      case 'General':
        return this.topGrillinVideos;
      case 'Tuesday Morning Coffee':
        return this.tuesdayMorningCoffeeVideos;
      case 'BBQ Recaps':
        return this.bbqRecaps.map((event: any) => ({
          href: event.href,
          thumbnail: event.thumbnail,
          title: event.title,
          timeAgo: event.date,
        }));
      case 'ROTW':
        return this.rotwRecords.map((record: any) => ({
          href: record.href,
          thumbnail: record.image,
          title: record.title,
          timeAgo: record.artist,
        }));
      case 'Popup':
        return this.topGrillinVideos.filter((video: any) =>
          video.title.toLowerCase().includes('pop')
        );
      default:
        return [];
    }
  }

  // Get filtered videos based on search query
  getSearchFilteredVideos() {
    const categoryVideos = this.getCategoryVideos();

    if (!this.searchQuery.trim()) {
      return categoryVideos;
    }

    const query = this.searchQuery.toLowerCase();
    return categoryVideos.filter((video: any) =>
      video.title.toLowerCase().includes(query) ||
      (video.timeAgo && video.timeAgo.toLowerCase().includes(query))
    );
  }

  // Get paginated videos for display
  getFilteredVideos() {
    const filteredVideos = this.getSearchFilteredVideos();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filteredVideos.slice(startIndex, endIndex);
  }

  // Update pagination when filters change
  updatePagination() {
    const totalVideos = this.getSearchFilteredVideos().length;
    this.totalPages = Math.ceil(totalVideos / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
  }

  // Check if showing filtered view (any category except 'All')
  isFilteredView(): boolean {
    return this.selectedCategory !== 'All';
  }
}
