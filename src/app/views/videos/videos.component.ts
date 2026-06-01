import { Component, OnInit, OnDestroy, signal, WritableSignal } from '@angular/core';
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
import { LegendsVideosService } from '@shared/services/legends/videos.service';
import { LegendsCategoriesService } from '@shared/services/legends/categories.service';
import { LegendsEngagementService } from '@shared/services/legends/engagement.service';
import { environment } from '@env/environment';
import { Video } from '@shared/models/video';
import { AppData } from 'src/app/app.data';
import { Category } from '@shared/models/category';
import { VideoService } from '@shared/services/video.service';
import { mappingFavorites, VideoAccessService } from '@shared/services/video-access.service';
import { FavoritesService } from '@shared/services/favorites.service';
import { TokenService } from '@shared/services/token.service';
import { AlertService } from '@shared/services/alert.service';
import { FavoriteId } from '@shared/models/favorite-id';
import { Config } from '@shared/config';
import { Observable, Subscription } from 'rxjs';
import { finalize, take } from 'rxjs/operators';

@Component({
  imports: [
    CommonModule,
    HeaderComponent,
    FreeTrialFormComponent,
    FooterComponent,
    VideoCarouselComponent,
    BBQRecapCarouselComponent,
    RecordCarouselComponent,
    SearchComponent,
    PaginationComponent,
  ],
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit, OnDestroy {
  selectedCategory: string = 'All';
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 60;
  totalPages: number = 1;

  categories: string[] = ['All'];
  categorieValues: string[] = ['all'];

  videoGroups = {
    all: {
      section: {
        title: 'All Videos',
        icon: '/img/videosImg.png',
        data: [] as Video[],
      },
      videos: [] as any[],
    },
  };

  bbqRecaps: any[] = [];

  rotwRecords: any[] = [
  ];

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
  private favSub?: Subscription;
  isLoggedIn$!: Observable<boolean>;
  processingFav = false;
  alertOptions = { autoClose: true, keepAfterRouteChange: false };

  constructor(private apiService: ApiService,
    private favoritesService: FavoritesService,
    private videoAccessService: VideoAccessService,
    public appData: AppData,
    private videoService: VideoService,
    private token: TokenService,
    private alertService: AlertService,
    private legendsVideos: LegendsVideosService,
    private legendsCategories: LegendsCategoriesService,
    private legendsEngagement: LegendsEngagementService) {}

  ngOnInit(): void {
      this.isLoggedIn$ = this.token.isValid(undefined);
      if (environment.ismock) {
        this.legendsVideos.getVideos({ category: this.selectedCategory }).subscribe((data: any) => {
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
            const allVideos = data?.data || [];
            this.videoGroups.all.section.data = allVideos;
            this.videoGroups.all.videos = allVideos;
            console.log('Fetched videos:', this.videoGroups.all.videos);
          },
          error: (err) => {
            console.error('Failed to fetch categories', err);
          }
        });

        // this.apiService.getSectionData('recap').subscribe({
        //   next: (data) => {
        //     this.bbqRecaps = data?.data?.filter((i: any) => i.summary && i?.category === 'bbq') || [];
        //     this.rotwRecords = data?.data?.filter((i: any) => i.summary && i?.category === 'rotw') || [];
        //     this.simpleBBQSection.data = data?.data?.filter((i: any) => !i.summary && i?.category === 'bbq') || [];
        //     this.simpleRecordSection.data = data?.data?.filter((i: any) => !i.summary && i?.category === 'rotw') || [];
        //     console.log('Fetched BBQ recaps:', this.bbqRecaps);
        //   },
        //   error: (err) => {
        //     console.error('Failed to fetch categories', err);
        //   }
        // });
      } else {
        this.isLoadingCategory.set(true);
        this.legendsCategories.getCategories('videos').subscribe((data: any) => {
          const categories = data.data as Category[];
          this.categories = ['All', ...categories.map(cat => cat.name)];
          this.categorieValues = ['All', ...categories.map(cat => cat.value)];
          this.isLoadingCategory.set(false);
        });
        
        this.selectCategory('All');
        // this.isLoadingRecap.set(true);
        // this.apiService.getData('videos', 'all&client=hls&sort=date&dir=desc', '').subscribe((data: any) => {
        //   data.data = mappingFavorites(data?.data || [], this.favoritesService.favorites);
        //   this.bbqRecaps = data?.data || [];
        //   this.rotwRecords = data?.data || [];
        //   this.simpleBBQSection.data = data?.data || [];
        //   this.simpleRecordSection.data = data?.data || [];
        //   this.isLoadingRecap.set(false);
        // },(error) => {
        //   this.isLoadingRecap.set(false);
        // });
      }

    this.favSub = this.videoService.getFavId().subscribe(({ itemId, favId }) => {
      if (!itemId) return;
      const updateList = (list: Video[]) => list.map(v => v.videoId === itemId ? { ...v, favId } : v);
      this.videoGroups.all.section.data = updateList(this.videoGroups.all.section.data || []);
      this.videoGroups.all.videos = updateList(this.videoGroups.all.videos || []);
    });
  }

  ngOnDestroy(): void {
    this.favSub?.unsubscribe();
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1; // Reset to first page when category changes
    this.searchQuery = ''; // Clear search when category changes
    
    this.isLoadingVideo.set(true);
    const cat = this.categorieValues[this.categories.indexOf(category)] || 'all';
    this.legendsVideos.getVideos({ category: cat?.toLowerCase() }).subscribe((data: any) => {
      data.data = mappingFavorites(data?.data || [], this.favoritesService.favorites);
      this.videoGroups.all.section.data = data?.data || [];
      this.videoGroups.all.videos = data?.data || [];
      this.isLoadingVideo.set(false);
      this.updatePagination();
    },(error) => {
      this.isLoadingVideo.set(false);
    });
      
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
        return this.videoGroups.all.videos.filter((v: any) => v.category === 'Top Grillin' || v.summary);
      case 'Tuesday Morning Coffee':
        return this.videoGroups.all.videos.filter((v: any) => v.title?.includes('Tuesday Morning Coffee'));
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
        return this.videoGroups.all.videos.filter((video: any) =>
          video.title.toLowerCase().includes('pop')
        );
      default:
        // Return all videos combined for 'All' category or any unmatched category
        return [
          ...this.videoGroups.all.videos,
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
    const searchFieldOne = 'title';
    const searchFieldTwo = 'featuring';

    return categoryVideos.filter((video: any) => {
      const hasFieldOne = !!video[searchFieldOne];
      const hasFieldTwo = !!video[searchFieldTwo];

      if (hasFieldOne && !hasFieldTwo) {
        return video[searchFieldOne]?.toLowerCase()?.includes(query);
      }

      if (!hasFieldOne && hasFieldTwo) {
        return video[searchFieldTwo]?.toLowerCase()?.includes(query);
      }

      return (
        video[searchFieldOne]?.toLowerCase()?.includes(query) ||
        video[searchFieldTwo]?.toLowerCase()?.includes(query)
      );
    });
  }

  // Get paginated videos for display
  getFilteredVideos(): Video[] {
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
    return true;
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
      favId: video.favId ?? 0,
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

  fav(event: any, video: Video) {
    if (!event || event.type !== 'click') {
      return;
    }
    event.preventDefault();
    event.stopPropagation();

    if (this.processingFav) {
      return;
    }

    this.processingFav = true;

    this.isLoggedIn$
      ?.pipe(take(1))
      .subscribe(valid => {
        if (valid) {
          const member = this.token.getMember();
          if (member?.status === 'current' || member?.status === 'canceled') {
            const fav: FavoriteId = {
              favId: video.favId ?? 0,
              itemId: video.videoId,
              section: 'video'
            };

            this.legendsEngagement.toggleFavorite(fav.itemId, fav.section)
              .pipe(finalize(() => {
                setTimeout(() => {
                  this.processingFav = false;
                }, 400);
              }))
              .subscribe(data => {
                if (data?.error) {
                  this.alertService.error('Error', data.msg, this.alertOptions);
                  return;
                }

                if (data?.id > 0) {
                  video.favId = data.id;
                  this.videoService.setFavoriteState(video.videoId, data.id);
                  this.alertService.success('Favorites', 'Media added to your Favorites.', this.alertOptions);
                } else {
                  video.favId = 0;
                  this.videoService.setFavoriteState(video.videoId, 0);
                  this.alertService.info('Favorites', 'Removed from Favorites.', this.alertOptions);
                }
              }, () => {
                this.processingFav = false;
              });
            return;
          }
        }

        // not logged in or no access
        const hasAccess = this.videoAccessService.checkVideoAccess(true);
        if (!hasAccess) {
          this.processingFav = false;
          return;
        }
        setTimeout(() => {
          this.processingFav = false;
        }, 400);
      });
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
    const hoverSrc = this.getHoverMedia(video);
    if (hoverSrc) {
      target.src = hoverSrc;
    }
  }

  showScreenshot(event: any, video: Video) {
    const target = event.target || event.srcElement || event.currentTarget;
    const poster = this.getPoster(video);
    if (poster) {
      target.src = poster;
    }
  }

  getPoster(video: Video): string {
    const thumbnail = (video as any)?.thumbnail as string | undefined;
    const isGif = (src?: string) => !!src && src.toLowerCase().includes('.gif');

    if (video.screenshot) {
      return video.screenshot;
    }

    if (thumbnail) {
      return thumbnail;
    }

    if (video.source === 'youtube' && video.sourceId) {
      return `//img.youtube.com/vi/${video.sourceId}/mqdefault.jpg`;
    }

    if (video.image && !isGif(video.image)) {
      return video.image;
    }

    return this.videoPoster;
  }

  getHoverMedia(video: Video): string {
    const thumbnail = (video as any)?.thumbnail as string | undefined;
    return video.image || thumbnail || video.screenshot || this.getPoster(video);
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

  formatDate(value?: string): string {
    if (!value) {
      return '';
    }

    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) {
      return value;
    }

    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
