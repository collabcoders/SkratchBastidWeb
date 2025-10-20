import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HeaderComponent } from '../../components/header/header.component';
import { FreeTrialFormComponent } from '../../components/free-trial-form/free-trial-form.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-video-detail',
  imports: [
    CommonModule,
    HeaderComponent,
    FreeTrialFormComponent,
    FooterComponent,
  ],
  templateUrl: './video-detail.component.html',
  styleUrl: './video-detail.component.scss',
})
export class VideoDetailComponent implements OnInit {
  videoId: string = '';
  videoTitle: string = 'Skratch Bastid – Pop-Up – Practice for Japan – Oct 1 2025';
  videoDate: string = '5 days ago';
  hasAudio: boolean = true;
  vimeoEmbedUrl: SafeResourceUrl = '';

  // New in Top Grillin videos
  topGrillinVideos = [
    {
      href: '/videos/skratch-bastid-tuesday-morning-coffee-october-10-2025',
      thumbnail:
        'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/7e4ea8cb-3786-4876-b965-c91462811fad.gif?ClientID=sulu&Date=1759864051&Signature=923cc605b5d7208e6d4857b30d0290fc6530e7bf',
      title: 'Skratch Bastid – Tuesday Morning Coffee October 10 2025',
      timeAgo: '5 days ago',
    },
    {
      href: '/videos/skratch-bastid-pop-up-practice-for-japan-oct-1-2025',
      thumbnail:
        'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/1b0f07f5-624f-432d-aaf9-f55dd4963224.gif?ClientID=sulu&Date=1759547060&Signature=38df09941c9dc11d1a554ecf8c387106414237a0',
      title: 'Skratch Bastid – Pop-Up – Practice for Japan – Oct 1 2025',
      timeAgo: '9 days ago',
    },
    {
      href: '/videos/skratch-bastid-mr-thing-tuesday-morning-coffee-sept-30-2025',
      thumbnail:
        'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/b6a9a37e-5e60-4c55-8a36-125b78103e63.gif?ClientID=sulu&Date=1759341510&Signature=45733f351b58dbd3a495cdf3efff48b790415e51',
      title: 'Skratch Bastid & Mr Thing – Tuesday Morning Coffee Sept 30 2025',
      timeAgo: '11 days ago',
    },
    {
      href: '/videos/skratch-bastid-tuesday-morning-coffee-live-from-playlist-retreat-secretly',
      thumbnail:
        'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/9038cd99-8ffa-43d5-a5cc-561132da0cb7.gif?ClientID=sulu&Date=1758910930&Signature=1dede87df7bfc8649950381bbb0068eada2c373a',
      title: 'Skratch Bastid – Tuesday Morning Coffee Live from Playlist Retreat (secretly)',
      timeAgo: '16 days ago',
    },
  ];

  // Tuesday Morning Coffee videos (Member Favourites)
  memberFavouritesVideos = [
    {
      href: '/videos/skratch-bastid-tuesday-morning-coffee-october-10-2025',
      thumbnail:
        'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/7e4ea8cb-3786-4876-b965-c91462811fad.gif?ClientID=sulu&Date=1759864051&Signature=923cc605b5d7208e6d4857b30d0290fc6530e7bf',
      title: 'Skratch Bastid – Tuesday Morning Coffee October 10 2025',
      timeAgo: '5 days ago',
    },
    {
      href: '/videos/skratch-bastid-mr-thing-tuesday-morning-coffee-sept-30-2025',
      thumbnail:
        'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/b6a9a37e-5e60-4c55-8a36-125b78103e63.gif?ClientID=sulu&Date=1759341510&Signature=45733f351b58dbd3a495cdf3efff48b790415e51',
      title: 'Skratch Bastid & Mr Thing – Tuesday Morning Coffee Sept 30 2025',
      timeAgo: '11 days ago',
    },
    {
      href: '/videos/skratch-bastid-tuesday-morning-coffee-live-from-playlist-retreat-secretly',
      thumbnail:
        'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/9038cd99-8ffa-43d5-a5cc-561132da0cb7.gif?ClientID=sulu&Date=1758910930&Signature=1dede87df7bfc8649950381bbb0068eada2c373a',
      title: 'Skratch Bastid – Tuesday Morning Coffee Live from Playlist Retreat (secretly)',
      timeAgo: '16 days ago',
    },
    {
      href: '/videos/skratch-bastid-tuesday-morning-coffee-sept-16-2025',
      thumbnail:
        'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/083e4589-adf4-4a5f-944a-6f541656a6ea.gif?ClientID=sulu&Date=1758295438&Signature=d85d7dec7f0b2f0e0cebd45d93c1a3cfacd8b802',
      title: 'Skratch Bastid – Tuesday Morning Coffee Sept 16 2025',
      timeAgo: '23 days ago',
    },
  ];

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.videoId = params['id'];
      // TODO: Fetch video details from service based on videoId
      // For now, using static Vimeo embed URL
      const url = `https://player.vimeo.com/video/${this.videoId}?badge=0&autopause=0&player_id=0&app_id=58479`;
      this.vimeoEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }

  goBack() {
    window.history.back();
  }
}
