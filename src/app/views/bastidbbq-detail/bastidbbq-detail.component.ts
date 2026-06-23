import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ApiService } from '@shared/services/api.service';
import { LegendsVideosService } from '@shared/services/legends/videos.service';
import { AlertService } from '@shared/services/alert.service';
import { Config } from '@shared/config';

export interface BBQRecapDetail {
  slug: string;
  city: string;
  date: string;
  venue: string;
  banner: string;
  recapId: string;
  cloudinaryFolder: string;
  photoCredits: string[];
  recapText: string;
  videos: {
    id: string;
    title: string;
  }[];
}

@Component({
  selector: 'app-bastidbbq-detail',
  imports: [
    HeaderComponent,
    FooterComponent
],
  templateUrl: './bastidbbq-detail.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './bastidbbq-detail.component.scss',
})
export class BastidBBQDetailComponent implements OnInit {
  recapDetail: BBQRecapDetail | null = null;
  loading = true;
  error: string | null = null;
  selectedTab = 'recap';
  showVideoPlayer = false;
  imageLoadingState: Record<string, boolean> = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private alertService: AlertService,
    private legendsVideos: LegendsVideosService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadRecapDetail(id);
    });
  }

  loadRecapDetail(id: number) {
    this.loading = true;
    this.error = null;

    // Use the existing API service pattern to fetch BBQ recap details
    this.legendsVideos.getVideo(id).subscribe((data) => {
      // const recaps = data?.data?.filter((d: any) => d.category === 'bbq') || [];
      const recap = data?.data;

      if (recap) {
        this.recapDetail = {
          slug: recap.slug || id,
          city: recap.city || 'Unknown City',
          date: this.formatDate(recap.date) || 'Unknown Date',
          venue: recap.venue || 'Unknown Venue',
          banner: recap.banner || recap.image || '/img/bbq-placeholder.jpg',
          recapId: recap.recapId || '',
          cloudinaryFolder: recap.cloudinaryFolder || '',
          photoCredits: recap.photoCredits || [],
          recapText: recap.recapText || '',
          videos: recap.videos || []
        };
      } else {
        // Fallback mock data for the Halifax recap shown in the original HTML
        this.recapDetail = {
          slug: 'halifax-2024',
          city: "Bastid's BBQ Halifax",
          date: 'September 7, 2024',
          venue: 'Alderney Landing',
          banner: 'https://res.cloudinary.com/dmlnwhtt2/image/upload/v1728655958/bbq-recaps/2024-bbq-halifax/2024-bbq-halifax_ijj7w7.jpg',
          recapId: 'Et1364ewKCg',
          cloudinaryFolder: 'bbq-recaps/2024-bbq-halifax',
          photoCredits: [],
          recapText: '',
          videos: []
        };
      }
      this.loading = false;
    }, (error) => {
      this.error = error?.error?.message || error?.message || "Failed to load BBQ recap details";
      this.loading = false;
      this.alertService.error('', this.error??'', Config.alertOptions);
    });
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  goBack() {
    this.router.navigate(['/bastidbbq']);
  }

  getYoutubeThumbnail(videoId: string): string {
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  }

  onImageLoaded(src: string) {
    this.imageLoadingState[src] = false;
  }

  isImageLoading(src?: string | null): boolean {
    if (!src) {
      return false;
    }

    return this.imageLoadingState[src] ?? true;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getOrigin(): string {
    return window.location.origin;
  }

  playVideo(): void {
    this.showVideoPlayer = true;
  }
}
