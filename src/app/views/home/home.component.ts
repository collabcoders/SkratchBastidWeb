import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { VideoHeroComponent } from '../../components/video-hero/video-hero.component';
import {
  VideoCarouselComponent,
  VideoSection,
} from '../../components/video-carousel/video-carousel.component';
import {
  MixesSliderComponent,
  MixesSection,
} from '../../components/mixes-slider/mixes-slider.component';
import { StoreProductsComponent } from '../../components/store-products/store-products.component';
import { BbqCtaComponent } from '../../components/bbq-cta/bbq-cta.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { FreeTrialFormComponent } from '../../components/free-trial-form/free-trial-form.component';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    VideoHeroComponent,
    VideoCarouselComponent,
    MixesSliderComponent,
    StoreProductsComponent,
    BbqCtaComponent,
    FooterComponent,
    FreeTrialFormComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  // Featured Videos Section (top hero section)
  featuredVideosSection: VideoSection = {
    title: 'Latest Live Sets',
    icon: '/img/videosImg.png',
    videos: [
      {
        thumbnail:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/7e4ea8cb-3786-4876-b965-c91462811fad.gif?ClientID=sulu&Date=1759864051&Signature=923cc605b5d7208e6d4857b30d0290fc6530e7bf',
        title: 'Skratch Bastid – Tuesday Morning Coffee October 10 2025',
        videoId: 1,
        source: 'vimeo',
        sourceId: '1018607107',
        hls: 'e8f4e0e6c9e1c9d43a6bb8e5d7abfc7ef1f6a6df',
        duration: '5:32',
        category: 'Live Sets',
        date: '2025-10-10',
        image:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/7e4ea8cb-3786-4876-b965-c91462811fad.gif?ClientID=sulu&Date=1759864051&Signature=923cc605b5d7208e6d4857b30d0290fc6530e7bf',
        featuring: '',
      },
      {
        thumbnail:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/1b0f07f5-624f-432d-aaf9-f55dd4963224.gif?ClientID=sulu&Date=1759547060&Signature=38df09941c9dc11d1a554ecf8c387106414237a0',
        title: 'Skratch Bastid – Pop-Up – Practice for Japan – Oct 1 2025',
        videoId: 2,
        source: 'vimeo',
        sourceId: '1016838892',
        hls: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
        duration: '6:15',
        category: 'Live Sets',
        date: '2025-10-01',
        image:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/1b0f07f5-624f-432d-aaf9-f55dd4963224.gif?ClientID=sulu&Date=1759547060&Signature=38df09941c9dc11d1a554ecf8c387106414237a0',
        featuring: '',
      },
    ],
    signUpText: 'WATCH FREE',
    signUpLink: '/videos',
  };

  // New in Top Grillin Section
  topGrillinSection: VideoSection = {
    title: 'New in Top Grillin',
    icon: '/img/newintopgrillin.png',
    videos: [
      {
        thumbnail:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/1b0f07f5-624f-432d-aaf9-f55dd4963224.gif?ClientID=sulu&Date=1759547060&Signature=38df09941c9dc11d1a554ecf8c387106414237a0',
        title: 'Skratch Bastid – Pop-Up – Practice for Japan – Oct 1 2025',
        videoId: 3,
        source: 'vimeo',
        sourceId: '1016838892',
        hls: 'def456',
        duration: '6:15',
        category: 'Top Grillin',
        date: '2025-10-01',
        image:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/1b0f07f5-624f-432d-aaf9-f55dd4963224.gif?ClientID=sulu&Date=1759547060&Signature=38df09941c9dc11d1a554ecf8c387106414237a0',
        featuring: '',
      },
      {
        thumbnail:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/b6a9a37e-5e60-4c55-8a36-125b78103e63.gif?ClientID=sulu&Date=1759341510&Signature=45733f351b58dbd3a495cdf3efff48b790415e51',
        title: 'Skratch Bastid & Mr Thing – Tuesday Morning Coffee Sept 30 2025',
        videoId: 4,
        source: 'vimeo',
        sourceId: '1015955893',
        hls: 'ghi789',
        duration: '8:45',
        category: 'Top Grillin',
        date: '2025-09-30',
        image:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/b6a9a37e-5e60-4c55-8a36-125b78103e63.gif?ClientID=sulu&Date=1759341510&Signature=45733f351b58dbd3a495cdf3efff48b790415e51',
        featuring: '',
      },
      {
        thumbnail:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/9038cd99-8ffa-43d5-a5cc-561132da0cb7.gif?ClientID=sulu&Date=1758910930&Signature=1dede87df7bfc8649950381bbb0068eada2c373a',
        title: 'Skratch Bastid – Tuesday Morning Coffee Live from Playlist Retreat',
        videoId: 5,
        source: 'vimeo',
        sourceId: '1014083449',
        hls: 'jkl012',
        duration: '7:20',
        category: 'Top Grillin',
        date: '2025-09-23',
        image:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/9038cd99-8ffa-43d5-a5cc-561132da0cb7.gif?ClientID=sulu&Date=1758910930&Signature=1dede87df7bfc8649950381bbb0068eada2c373a',
        featuring: '',
      },
    ],
    signUpText: 'Sign up',
    signUpLink: '/join',
  };

  // Mixes Section
  mixesSection: MixesSection = {
    title: 'Mixes',
    icon: '/img/latest_mixes.png',
    mixes: [
      {
        image:
          'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/e/0/a/1/9cb7-4ff2-4157-8379-54efebc741ac',
        title: 'Skratch Bastid - Dinner (A Mixtape) 4.12.18',
        artist: 'Skratch Bastid',
        href: 'https://www.mixcloud.com/skratchbastid/skratch-bastid-dinner-a-mixtape-41218/',
      },
      {
        image:
          'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/e/b/c/2/a3d2-6a91-4c27-9eee-c845a489e030.jpg',
        title: 'The Gaff - Soul Sisters Stand Up (100% Female Funk/Soul/R&B/Breaks)',
        artist: 'Skratch Bastid',
        href: 'https://www.mixcloud.com/skratchbastid/skratch-bastid-the-gaff-soul-sisters-stand-up-100-female-funksoulrbbreaks/',
      },
      {
        image:
          'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/2/1/e/9/bde2-8de1-4e85-8978-e1aed313c9e6.jpg',
        title: 'The Starter Era (Dope Raps 1989-1993) Sneaker Freaker Magazine Exclusive',
        artist: 'Skratch Bastid',
        href: 'https://www.mixcloud.com/skratchbastid/skratch-bastid-the-starter-era-dope-raps-1989-1993-sneaker-freaker-magazine-exclusive/',
      },
      {
        image:
          'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/5/7/c/2/c7e8-e095-42e1-a751-fb51772a4473.png',
        title: 'The Entertainer',
        artist: 'Skratch Bastid',
        href: 'https://www.mixcloud.com/skratchbastid/the-entertainer/',
      },
      {
        image:
          'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/2/c/d/9/5b72-edd3-4317-b49d-28a38f9a3da0.jpg',
        title: '110%',
        artist: 'Skratch Bastid',
        href: 'https://www.mixcloud.com/skratchbastid/skratch-bastid-110/',
      },
      {
        image:
          'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/a/3/4/4/b475-e99f-491e-886f-3ff2820ec7bd.jpg',
        title: 'Satisfaction Guaranteed',
        artist: 'Skratch Bastid',
        href: 'https://www.mixcloud.com/skratchbastid/skratch-bastid-satisfaction-guaranteed/',
      },
      {
        image:
          'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/c/2/f/d/0ded-0b9e-45ea-81e1-007fd8e75c0d.jpg',
        title: 'Get Up!',
        artist: 'Skratch Bastid',
        href: 'https://www.mixcloud.com/skratchbastid/skratch-bastid-get-up/',
      },
    ],
    signUpText: 'Sign up',
    signUpLink: '/join',
  };
}
