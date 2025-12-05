import { Component, OnInit, signal, WritableSignal } from '@angular/core';
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
import { environment } from '@env/environment';
import { Video } from '@shared/models/video';
import { AppData } from 'src/app/app.data';
import { Category } from '@shared/models/category';
import { VideoService } from '@shared/services/video.service';
import { mappingFavorites, VideoAccessService } from '@shared/services/video-access.service';
import { FavoritesService } from '@shared/services/favorites.service';

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

  isLoadingVideo: WritableSignal<boolean> = signal(false);
  isLoadingCategory: WritableSignal<boolean> = signal(false);
  isLoadingRecap: WritableSignal<boolean> = signal(false);

  constructor(private apiService: ApiService, private favoritesService: FavoritesService, private videoAccessService: VideoAccessService, public appData: AppData, private videoService: VideoService) {}

  ngOnInit(): void {
      if (environment.ismock) {
        this.apiService.getData('videos', this.selectedCategory, '&sort=date&dir=desc').subscribe((data: any) => {
          console.log("DATA", data);
        });
        
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
      } else {
        this.isLoadingCategory.set(true);
        this.apiService.getData('categories', 'videos', '', 'beats').subscribe((data: any) => {
          const categories = data.data as Category[];
          this.categories = ['All', ...categories.map(cat => cat.name)];
          this.isLoadingCategory.set(false);
        });
        
        this.isLoadingVideo.set(true);
        this.apiService.getData('videos', 'livestream--&client=hls&sort=date&dir=desc', '').subscribe((data: any) => {
          data.data = mappingFavorites(data?.data || [], this.favoritesService.favorites);
          this.topGrillinSection.data = data?.data || [];
          this.tuesdayMorningCoffeeSection.data = data?.data || [];
          this.topGrillinVideos = data?.data || [];
          this.tuesdayMorningCoffeeVideos = data?.data || [];
          this.isLoadingVideo.set(false);
        },(error) => {
          this.isLoadingVideo.set(false);
        });
        
        this.isLoadingRecap.set(true);
        this.apiService.getData('videos', 'livestream--&client=hls&sort=date&dir=desc', '').subscribe((data: any) => {
          data.data = mappingFavorites(data?.data || [], this.favoritesService.favorites);
          this.bbqRecaps = data?.data || [];
          this.rotwRecords = data?.data || [];
          this.simpleBBQSection.data = data?.data || [];
          this.simpleRecordSection.data = data?.data || [];
          this.isLoadingRecap.set(false);
        },(error) => {
          this.isLoadingRecap.set(false);
        });
      }
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
        // Return all videos combined for 'All' category or any unmatched category
        return [
          ...this.topGrillinVideos,
          ...this.tuesdayMorningCoffeeVideos,
          ...this.bbqRecaps.map((event: any) => ({
            href: event.href,
            thumbnail: event.thumbnail,
            title: event.title,
            timeAgo: event.date,
          })),
          ...this.rotwRecords.map((record: any) => ({
            href: record.href,
            thumbnail: record.image,
            title: record.title,
            timeAgo: record.artist,
          }))
        ];;
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

  playVideo(video: Video) {
    const hasAccess = this.videoAccessService.checkVideoAccess(true);

    if (!hasAccess) {
      // Dialog will be shown automatically by the service
      return;
    }

    // Convert VideoMix to Video format
    const videoData: Video= {
      videoId: video.videoId || 0,
      title: video.title,
      source: video.source || 'vimeo',
      sourceId: video.sourceId || '',
      hls: video.hls || '',
      duration: video.duration || '0:00',
      category: video.category || '',
      featuring: video.featuring || '',
      image: video.image || video.image,
      screenshot: video.screenshot,
      date: video.date || new Date().toISOString(),
      audio1: '',
      favId: 0,
      featured: 0
    };

    console.log(72, 'here,', video);
    // Show the video player
    this.videoService.showPlayer(videoData);

    // Open the Bootstrap modal using Bootstrap 5 native API
    setTimeout(() => {
      const modalElement = document.getElementById('videoModal');
      if (modalElement) {
        // Check if Bootstrap is loaded
        if (typeof (window as any).bootstrap !== 'undefined') {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
        } else if (typeof $ !== 'undefined' && typeof ($ as any).fn.modal !== 'undefined') {
          // Fallback to jQuery if available
          ($('#videoModal') as any).modal('show');
        } else {
          console.error('Bootstrap modal is not available');
        }
      }
    }, 100);
  }

  videoPoster = '/public/logo.png';
  checkImage(event: any, video: Video) {
    const target = event.target || event.srcElement || event.currentTarget;
    let imgElement = new Image();
    imgElement.src = target.src;
    imgElement.addEventListener('load', () => {
      //console.log(imgElement.naturalHeight + ' x ' + imgElement.naturalWidth);
      if (video.source == 'vimeo' && imgElement.naturalHeight === 480 && imgElement.naturalWidth === 640) {
        target.src = this.videoPoster;
        imgElement.onload = null;
      }
      if (video.source == 'youtube' && imgElement.naturalHeight === 90 && imgElement.naturalWidth === 120) {
        target.src = this.videoPoster;
        imgElement.onload = null;
      }
    });
    imgElement.addEventListener('error', () => {
      target.src = this.videoPoster;
      imgElement.onload = null;
    });
  }

  errorImage(event: any, video: Video) {
    const target = event.target || event.srcElement || event.currentTarget;
    let imgElement = new Image();
    imgElement.src = target.src;
    target.src = target.src = this.videoPoster;
    imgElement.onload = null;
  }

  showGif(event: any, video: Video) {
    const target = event.target || event.srcElement || event.currentTarget;
    target.src = video.image;
  }

  showScreenshot(event: any, screenshot: string) {
    const target = event.target || event.srcElement || event.currentTarget;
    target.src = screenshot;
  }
}
