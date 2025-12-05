import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ApiService } from '@shared/services/api.service';
import { AlertService } from '@shared/services/alert.service';
import { Config } from '@shared/config';
import { Video } from '@shared/models/video';

export interface RotwDetail {
  slug: string;
  title: string;
  artist: string;
  albumArt: string;
  logoImage: string;
  videoId: string;
  releaseDate?: string;
  label?: string;
  genre?: string;
}

@Component({
  selector: 'app-rotw-detail',
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './rotw-detail.component.html',
  styleUrl: './rotw-detail.component.scss',
})
export class RotwDetailComponent implements OnInit {
  rotwDetail: Video | null = null;
  loading = true;
  error: string | null = null;
  allRotwRecords: Video[] = [];
  currentIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadRotwDetail(id);
    });
  }

  loadRotwDetail(id: any) {
    this.loading = true;
    this.error = null;

    console.log("loadRotwDetail", id);
    // Use the existing API service pattern to fetch ROTW details
    this.apiService.getItem("videos", id).subscribe((data) => {
      // const rotwRecords = data?.data?.filter((d: any) => d.category === 'rotw') || [];

      // Convert all records to our format
      this.allRotwRecords = data?.data;

      // // Add fallback mock data if no records exist
      // if (this.allRotwRecords.length === 0) {
      //   this.allRotwRecords = [
      //     {
      //       slug: 'slum-village-fun',
      //       title: 'F.U.N.',
      //       artist: 'Slum Village',
      //       albumArt: 'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/c26eada0-a5a4-405b-ed63-d92b4fbc4600/w=500',
      //       logoImage: 'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/ca8fd383-4e18-4141-555c-221ae8853d00/w=500',
      //       videoId: 'NUZrfg4woGM'
      //     },
      //     {
      //       slug: 'tom-novy',
      //       title: 'Another Track',
      //       artist: 'Tom Novy',
      //       albumArt: 'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/c26eada0-a5a4-405b-ed63-d92b4fbc4600/w=500',
      //       logoImage: 'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/ca8fd383-4e18-4141-555c-221ae8853d00/w=500',
      //       videoId: 'NUZrfg4woGM'
      //     },
      //     {
      //       slug: 'spice-1',
      //       title: 'Spice Track',
      //       artist: 'Spice 1',
      //       albumArt: 'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/c26eada0-a5a4-405b-ed63-d92b4fbc4600/w=500',
      //       logoImage: 'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/ca8fd383-4e18-4141-555c-221ae8853d00/w=500',
      //       videoId: 'NUZrfg4woGM'
      //     }
      //   ];
      // }

      // Find current record and set index
      // this.currentIndex = this.allRotwRecords.findIndex(r => r.slug === id);
      if (this.currentIndex === -1) {
        this.currentIndex = 0;
      }

      this.rotwDetail = this.allRotwRecords[this.currentIndex];
      this.loading = false;
    }, (error) => {
      this.error = error?.error?.message || error?.message || "Failed to load ROTW details";
      this.loading = false;
      this.alertService.error('', this.error ?? '', Config.alertOptions);
    });
  }

  goBack() {
    this.router.navigate(['/videos']);
  }

  getYoutubeThumbnail(videoId: string): string {
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  }

  // navigateToPrevious() {
  //   if (this.allRotwRecords.length === 0) return;

  //   const prevIndex = this.currentIndex === 0 ? this.allRotwRecords.length - 1 : this.currentIndex - 1;
  //   const prevRecord = this.allRotwRecords[prevIndex];
  //   this.router.navigate(['/rotw', prevRecord.slug]);
  // }

  // navigateToNext() {
  //   if (this.allRotwRecords.length === 0) return;

  //   const nextIndex = this.currentIndex === this.allRotwRecords.length - 1 ? 0 : this.currentIndex + 1;
  //   const nextRecord = this.allRotwRecords[nextIndex];
  //   this.router.navigate(['/rotw', nextRecord.slug]);
  // }

  hasPrevious(): boolean {
    return this.allRotwRecords.length > 1;
  }

  hasNext(): boolean {
    return this.allRotwRecords.length > 1;
  }
}