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
export class VideosComponent {
  selectedCategory: string = 'All';
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;

  categories = ['All', 'General', 'Tuesday Morning Coffee', 'BBQ Recaps', 'ROTW', 'Popup'];

  // Add missing properties referenced in template and methods
  topGrillinVideos: any[] = [
    {
      href: '/videos/skratch-bastid-tuesday-morning-coffee-october-10-2025',
      thumbnail:
        'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/7e4ea8cb-3786-4876-b965-c91462811fad.gif?ClientID=sulu&Date=1759864051&Signature=923cc605b5d7208e6d4857b30d0290fc6530e7bf',
      title: 'Skratch Bastid – Tuesday Morning Coffee October 10 2025',
      timeAgo: '1 day ago',
    },
    {
      href: '/videos/skratch-bastid-pop-up-practice-for-japan-oct-1-2025',
      thumbnail:
        'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/1b0f07f5-624f-432d-aaf9-f55dd4963224.gif?ClientID=sulu&Date=1759547060&Signature=38df09941c9dc11d1a554ecf8c387106414237a0',
      title: 'Skratch Bastid – Pop-Up – Practice for Japan – Oct 1 2025',
      timeAgo: '10 days ago',
    },
  ];

  tuesdayMorningCoffeeVideos: any[] = [
    {
      href: '/videos/skratch-bastid-tuesday-morning-coffee-october-10-2025',
      thumbnail:
        'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/7e4ea8cb-3786-4876-b965-c91462811fad.gif?ClientID=sulu&Date=1759864051&Signature=923cc605b5d7208e6d4857b30d0290fc6530e7bf',
      title: 'Skratch Bastid – Tuesday Morning Coffee October 10 2025',
      timeAgo: '1 day ago',
    },
    {
      href: '/videos/skratch-bastid-mr-thing-tuesday-morning-coffee-sept-30-2025',
      thumbnail:
        'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/b6a9a37e-5e60-4c55-8a36-125b78103e63.gif?ClientID=sulu&Date=1759341510&Signature=45733f351b58dbd3a495cdf3efff48b790415e51',
      title: 'Skratch Bastid & Mr Thing – Tuesday Morning Coffee Sept 30 2025',
      timeAgo: '11 days ago',
    },
  ];

  bbqRecaps: any[] = [
    {
      href: '/bbq-recaps/halifax-2024',
      thumbnail:
        'https://i.ytimg.com/vi/Et1364ewKCg/hqdefault.jpg?sqp=-oaymwFBCNACELwBSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGE4gZShjMA8=&rs=AOn4CLDpZc2f-vF8KjHvO9JmLhQpRQE_9Q',
      title: 'Halifax',
      date: 'September 07, 2024',
    },
    {
      href: '/bbq-recaps/edmonton-2024',
      thumbnail:
        'https://i.ytimg.com/vi/R6HuK_urkKg/hqdefault.jpg?sqp=-oaymwFBCNACELwBSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGD8gWihyMA8=&rs=AOn4CLBqVMjCIw05vrsH6qFVYdNNbfxNWw',
      title: 'Edmonton',
      date: 'August 25, 2024',
    },
  ];

  rotwRecords: any[] = [
    {
      href: '/rotw/tom-novy',
      image:
        'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/da97e8e8-6cb0-4937-507f-bb94e7ad2300/w=300',
      title: 'Do It Right (feat. Omar)',
      artist: 'Tom Novy',
    },
    {
      href: '/rotw/slum-village',
      image:
        'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/c26eada0-a5a4-405b-ed63-d92b4fbc4600/w=300',
      title: 'F.U.N.',
      artist: 'Slum Village',
    },
  ];

  // Video sections for carousels
  topGrillinSection: VideoSection = {
    title: 'New in Top Grillin',
    icon: '/img/videosImg.png',
    videos: [
      {
        link: '/videos/skratch-bastid-tuesday-morning-coffee-october-10-2025',
        thumbnail:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/7e4ea8cb-3786-4876-b965-c91462811fad.gif?ClientID=sulu&Date=1759864051&Signature=923cc605b5d7208e6d4857b30d0290fc6530e7bf',
        title: 'Skratch Bastid – Tuesday Morning Coffee October 10 2025',
        videoId: 1,
        source: 'vimeo',
        sourceId: '1018607107',
        hls: 'e8f4e0e6c9e1c9d43a6bb8e5d7abfc7ef1f6a6df',
        duration: '01:28:02',
        category: 'Tuesday Morning Coffee',
        featuring: '',
        image:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/7e4ea8cb-3786-4876-b965-c91462811fad.gif?ClientID=sulu&Date=1759864051&Signature=923cc605b5d7208e6d4857b30d0290fc6530e7bf',
        date: new Date().toISOString(),
      },
      {
        link: '/videos/skratch-bastid-pop-up-practice-for-japan-oct-1-2025',
        thumbnail:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/1b0f07f5-624f-432d-aaf9-f55dd4963224.gif?ClientID=sulu&Date=1759547060&Signature=38df09941c9dc11d1a554ecf8c387106414237a0',
        title: 'Skratch Bastid – Pop-Up – Practice for Japan – Oct 1 2025',
        videoId: 2,
        source: 'vimeo',
        sourceId: '1016838892',
        hls: 'def456',
        duration: '00:58:00',
        category: 'Popup',
        featuring: '',
        image:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/1b0f07f5-624f-432d-aaf9-f55dd4963224.gif?ClientID=sulu&Date=1759547060&Signature=38df09941c9dc11d1a554ecf8c387106414237a0',
        date: new Date().toISOString(),
      },
      {
        link: '/videos/skratch-bastid-mr-thing-tuesday-morning-coffee-sept-30-2025',
        thumbnail:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/b6a9a37e-5e60-4c55-8a36-125b78103e63.gif?ClientID=sulu&Date=1759341510&Signature=45733f351b58dbd3a495cdf3efff48b790415e51',
        title: 'Skratch Bastid & Mr Thing – Tuesday Morning Coffee Sept 30 2025',
        videoId: 3,
        source: 'vimeo',
        sourceId: '1015955893',
        hls: 'ghi789',
        duration: '01:00:08',
        category: 'Tuesday Morning Coffee',
        featuring: '',
        image:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/b6a9a37e-5e60-4c55-8a36-125b78103e63.gif?ClientID=sulu&Date=1759341510&Signature=45733f351b58dbd3a495cdf3efff48b790415e51',
        date: new Date().toISOString(),
      },
      {
        link: '/videos/skratch-bastid-tuesday-morning-coffee-live-from-playlist-retreat-secretly',
        thumbnail:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/9038cd99-8ffa-43d5-a5cc-561132da0cb7.gif?ClientID=sulu&Date=1758910930&Signature=1dede87df7bfc8649950381bbb0068eada2c373a',
        title: 'Skratch Bastid – Tuesday Morning Coffee Live from Playlist Retreat (secretly)',
        videoId: 4,
        source: 'vimeo',
        sourceId: '1015955894',
        hls: 'ghi790',
        duration: '01:01:07',
        category: 'Tuesday Morning Coffee',
        featuring: '',
        image:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/9038cd99-8ffa-43d5-a5cc-561132da0cb7.gif?ClientID=sulu&Date=1758910930&Signature=1dede87df7bfc8649950381bbb0068eada2c373a',
        date: new Date().toISOString(),
      },
    ],
  };

  tuesdayMorningCoffeeSection: any = {
    title: 'Tuesday Morning Coffee',
    icon: '/img/videosImg.png',
    videos: [
      {
        link: '/videos/skratch-bastid-tuesday-morning-coffee-october-10-2025',
        thumbnail:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/7e4ea8cb-3786-4876-b965-c91462811fad.gif?ClientID=sulu&Date=1759864051&Signature=923cc605b5d7208e6d4857b30d0290fc6530e7bf',
        title: 'Skratch Bastid – Tuesday Morning Coffee October 10 2025',
        videoId: 5,
        source: 'vimeo',
        sourceId: '1018607108',
        hls: 'abc123',
        duration: '01:30:00',
        category: 'Tuesday Morning Coffee',
        featuring: '',
        image:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/7e4ea8cb-3786-4876-b965-c91462811fad.gif?ClientID=sulu&Date=1759864051&Signature=923cc605b5d7208e6d4857b30d0290fc6530e7bf',
        date: new Date().toISOString(),
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
      {
        href: '/videos/skratch-bastid-tuesday-morning-coffee-sept-9-2025',
        thumbnail:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/48589e1f-3d1a-4770-9152-eb21e5158cb9.gif?ClientID=sulu&Date=1757445183&Signature=e820767f274fe7b32cf6fbf91f650f5e6f19ba4e',
        title: 'Skratch Bastid – Tuesday Morning Coffee Sept 9 2025',
        timeAgo: 'a month ago',
      },
      {
        href: '/videos/skratch-bastid-tuesday-morning-coffee-aug-26-2025',
        thumbnail:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/08195ca2-27bb-4f0c-9d70-b7793b09064e.gif?ClientID=sulu&Date=1756330161&Signature=01b8e2c5621e22b1d07ab110b1a68cd126c63fda',
        title: 'Skratch Bastid – Tuesday Morning Coffee Aug 26 2025',
        timeAgo: 'a month ago',
      },
      {
        href: '/videos/tuesday-morning-coffee-post-toronto-bbq-edition-with-dj-rena-july-29-2025',
        thumbnail:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/dc5337a7-321e-410b-877e-3dec783db29f.gif?ClientID=sulu&Date=1754060446&Signature=73a708980805e8525d79a67536d73e5df8e2f0de',
        title: 'Tuesday Morning Coffee Post Toronto BBQ edition! with DJ Rena July 29 2025',
        timeAgo: '2 months ago',
      },
      {
        href: '/videos/skratch-bastid-tuesday-morning-coffee-w-guest-interview-w-dj-premier-july-8-2025',
        thumbnail:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/fb0edf42-1af4-425b-b530-4c5275fa37c5.gif?ClientID=sulu&Date=1752012261&Signature=ff356864e202f822c4e952b961312489989c3fec',
        title:
          'Skratch Bastid – Tuesday Morning Coffee w/ guest interview w DJ Premier July 8 2025',
        timeAgo: '3 months ago',
      },
      {
        href: '/videos/skratch-bastid-tuesday-morning-coffee-with-special-guest-bobbito-garcia-june-24-2025',
        thumbnail:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/882e3ccf-7f5d-4a49-b56d-8e66240dc790.gif?ClientID=sulu&Date=1750999205&Signature=85ce129485a4323d358c2ece1c3706b7ac19ed3a',
        title:
          'Skratch Bastid Tuesday Morning Coffee with special guest Bobbito Garcia – June 24 2025',
        timeAgo: '4 months ago',
      },
      {
        href: '/videos/skratch-bastid-w-guests-drastik-thugli-and-trayze-tuesday-morning-coffee-june-17-2025',
        thumbnail:
          'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/e0166b16-1c56-45c2-9520-81c10a9d74f6.gif?ClientID=sulu&Date=1750211122&Signature=3326657d36876de93c4aa80d6505112eaeee5acc',
        title:
          'Skratch Bastid w/ guests Drastik (Thugli) and Trayze – Tuesday Morning Coffee June 17 2025',
        timeAgo: '4 months ago',
      },
    ],
  };

  simpleBBQSection: BBQRecapSection = {
    title: 'BBQ Recaps',
    icon: '/img/videosImg.png',
    recaps: [
      {
        slug: 'halifax-2024',
        city: 'Halifax',
        date: 'September 07, 2024',
        venue: 'Alderney Landing',
        image:
          'https://i.ytimg.com/vi/Et1364ewKCg/hqdefault.jpg?sqp=-oaymwFBCNACELwBSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGE4gZShjMA8=&rs=AOn4CLDpZc2f-vF8KjHvO9JmLhQpRQE_9Q',
      },
      {
        slug: 'edmonton-2024',
        city: 'Edmonton',
        date: 'August 25, 2024',
        venue: 'The Backyard',
        image:
          'https://i.ytimg.com/vi/R6HuK_urkKg/hqdefault.jpg?sqp=-oaymwFBCNACELwBSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-CYAC0AWKAgwIABABGD8gWihyMA8=&rs=AOn4CLBqVMjCIw05vrsH6qFVYdNNbfxNWw',
      },
      {
        slug: 'edmonton-2024',
        city: 'Edmonton',
        date: 'August 25, 2024',
        venue: 'The Backyard',
        image:
          'https://i.ytimg.com/vi/R6HuK_urkKg/hqdefault.jpg?sqp=-oaymwFBCNACELwBSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-CYAC0AWKAgwIABABGD8gWihyMA8=&rs=AOn4CLBqVMjCIw05vrsH6qFVYdNNbfxNWw',
      },
      {
        slug: 'vancouver-2024',
        city: 'Vancouver',
        date: 'August 11, 2024',
        venue: 'The Birdhouse',
        image:
          'https://i.ytimg.com/vi/qln1xpuuzKs/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBcn_Ozzje7jBLA5iTnD9d9FNX6bQ',
      },
      {
        slug: 'toronto-2024',
        city: 'Toronto',
        date: 'July 27, 2024',
        venue: 'The Bentway',
        image:
          'https://i.ytimg.com/vi/nRXq3odkjxw/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDtrDP6CcwcmIE97turiP1a20RYzw',
      },
      {
        slug: 'nyc-2024',
        city: 'New York City',
        date: 'June 08, 2024',
        venue: 'The Seaport',
        image:
          'https://i.ytimg.com/vi/EGxJ9pwXkqE/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBpsa7Xm8_JSB-lRKi8dPbHVIGh4w',
      },
      {
        slug: 'calgary-2024',
        city: 'Calgary',
        date: 'June 06, 2024',
        venue: 'Whiskey Rose',
        image:
          'https://i.ytimg.com/vi/dvX-XijCIZE/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBSFS6Fq4g9HL003gQ-2vDvTnxN9w',
      },
      {
        slug: 'austin-2024',
        city: 'Austin',
        date: 'March 15, 2024',
        venue: 'Inn Cahoots',
        image:
          'https://res.cloudinary.com/dmlnwhtt2/image/upload/v1724290322/bbq-recaps/2024-bbq-austin/austin-bbq-24_h2ofmj.jpg',
      },
      {
        slug: 'edmonton-2023',
        city: 'Edmonton',
        date: 'August 27, 2023',
        venue: 'Home & Away',
        image:
          'https://i.ytimg.com/vi/R6HuK_urkKg/hqdefault.jpg?sqp=-oaymwFBCNACELwBSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGD8gWihyMA8=&rs=AOn4CLBqVMjCIw05vrsH6qFVYdNNbfxNWw',
      },
      {
        slug: 'nyc-2023',
        city: 'New York City',
        date: 'August 20, 2023',
        venue: 'The Seaport',
        image:
          'https://i.ytimg.com/vi/EGxJ9pwXkqE/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBpsa7Xm8_JSB-lRKi8dPbHVIGh4w',
      },
      {
        slug: 'vancouver-2023',
        city: 'Vancouver',
        date: 'August 13, 2023',
        venue: 'The Birdhouse',
        image:
          'https://i.ytimg.com/vi/qln1xpuuzKs/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBcn_Ozzje7jBLA5iTnD9d9FNX6bQ',
      },
      {
        slug: 'toronto-2023',
        city: 'Toronto',
        date: 'July 29, 2023',
        venue: 'The Bentway',
        image:
          'https://i.ytimg.com/vi/nRXq3odkjxw/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDtrDP6CcwcmIE97turiP1a20RYzw',
      },
      {
        slug: 'winnipeg-2023',
        city: 'Winnipeg',
        date: 'July 16, 2023',
        venue: '211 McDermot Ave.',
        image:
          'https://res.cloudinary.com/dmlnwhtt2/image/upload/v1693429777/bbq-recaps/2023-bbq-winnipeg/BASTIDSBBQ-WINNIPEG-EVENTBRITE-LINEUP-MOCK-02_jfhmqw.png',
      },
      {
        slug: 'calgary-2023',
        city: 'Calgary',
        date: 'July 08, 2023',
        venue: 'Whiskey Rose',
        image:
          'https://i.ytimg.com/vi/dvX-XijCIZE/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBSFS6Fq4g9HL003gQ-2vDvTnxN9w',
      },
      {
        slug: 'chicago-2023',
        city: 'Chicago',
        date: 'June 03, 2023',
        venue: 'House of Vans',
        image:
          'https://i.ytimg.com/vi/zTlpY8kDmms/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLD2PtWGY0hI0uDdtw9XwAcyXWZosg',
      },
      {
        slug: 'las-vegas-2023',
        city: 'Las Vegas',
        date: 'April 30, 2023',
        venue: 'We All Scream',
        image:
          'https://res.cloudinary.com/dmlnwhtt2/image/upload/v1694477323/bbq-recaps/2023-bbq-vegas/BASTIDSBBQ-LASVEGAS-EVENTBRITE-MOCK-03_mvydwo.png',
      },
      {
        slug: 'austin-2023',
        city: 'Austin',
        date: 'March 17, 2023',
        venue: 'SXSW',
        image:
          'https://res.cloudinary.com/dmlnwhtt2/image/upload/v1693869671/bbq-recaps/2023-bbq-austin/BASTIDSBBQ-AUSTIN-EVENTBRITE-MOCK-05_1_efxtha.png',
      },
    ],
  };

  simpleRecordSection: RecordSection = {
    title: 'Record of the Week',
    icon: '/img/videosImg.png',
    records: [
      {
        href: '/rotw/tom-novy',
        image:
          'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/da97e8e8-6cb0-4937-507f-bb94e7ad2300/w=300',
        title: 'Do It Right (feat. Omar)',
        artist: 'Tom Novy',
      },
      {
        href: '/rotw/slum-village',
        image:
          'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/c26eada0-a5a4-405b-ed63-d92b4fbc4600/w=300',
        title: 'F.U.N.',
        artist: 'Slum Village',
      },
      {
        href: '/rotw/slum-village',
        image:
          'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/c26eada0-a5a4-405b-ed63-d92b4fbc4600/w=300',
        title: 'F.U.N.',
        artist: 'Slum Village',
      },
      {
        href: '/rotw/spice-1',
        image:
          'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/3259b09e-9855-4937-6817-11c48ff6ff00/w=300',
        title: 'Since The Day (prod. DJ Premier)',
        artist: 'Spice 1 feat. CL Smooth',
      },
      {
        href: '/rotw/roy-ayers-ubiquity',
        image:
          'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/07ec5384-b83c-45f8-c90d-20fd6cdc7800/w=300',
        title: "He's Coming",
        artist: 'Roy Ayers Ubiquity',
      },
      {
        href: '/rotw/jeremy-carr',
        image:
          'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/236596ea-fd19-45bd-0a16-4e32d567ff00/w=300',
        title: 'This Must be Heaven',
        artist: 'Jeremy Carr',
      },
      {
        href: '/rotw/yg-marley',
        image:
          'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/10615d19-c765-404b-6d1c-378eb3784300/w=300',
        title: 'Praise Jah In The Moonlight',
        artist: 'YG Marley',
      },
      {
        href: '/rotw/nxworries',
        image:
          'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/57d69264-3b88-479c-5f13-2f9a7e880700/w=300',
        title: '86Sentra',
        artist: 'NxWorries',
      },
      {
        href: '/rotw/lord-sko',
        image:
          'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/403a47e3-d178-46b5-844e-baf05032cb00/w=300',
        title: 'Pimp Socks',
        artist: 'Lord Sko',
      },
      {
        href: '/rotw/sir-karma',
        image:
          'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/7d2c6f88-8545-40a8-aada-3446d7051500/w=300',
        title: 'Karma',
        artist: 'Sir',
      },
      {
        href: '/rotw/garfield-fleming',
        image:
          'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/593a686b-2483-4a64-9135-17be47966300/w=300',
        title: "Don't Send Me Away",
        artist: 'Garfield Fleming',
      },
    ],
  };

  constructor() {}

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
