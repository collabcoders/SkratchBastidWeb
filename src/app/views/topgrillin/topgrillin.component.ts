import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { FreeTrialFormComponent } from '../../components/free-trial-form/free-trial-form.component';
import {
  VideoCarouselComponent,
  VideoSection,
} from '../../components/video-carousel/video-carousel.component';

@Component({
  selector: 'app-topgrillin',
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    VideoCarouselComponent,
    FreeTrialFormComponent,
  ],
  templateUrl: './topgrillin.component.html',
  styleUrl: './topgrillin.component.scss',
})
export class TopGrillinComponent {
  isAnnual = false;

  vipFeatures = [
    'Stream over 2,000 hours of exclusive DJ sets',
    'VIP-only streams',
    'Full WhatsApp Community Access',
    '10% off entire online store',
    'Pre-sale and first access to new merch drops',
  ];

  platformFeatures = [
    {
      number: '1',
      title: 'Videos',
      description: 'Stream private performances and 500+ hours of archived content.',
    },
    {
      number: '2',
      title: 'Audios',
      description: 'Enjoy exclusive mixes and curated playlists.',
    },
    {
      number: '3',
      title: "Bastid's BBQ",
      description: 'Score discounts and early access to events.',
    },
  ];

  pricingFeatures = [
    'Free features.',
    'Stream over 2,000 hours of exclusive DJ sets.',
    'VIP-only streams.',
    'Discord Server.',
    'Pre-sale and first access to new merch drops.',
    '10% off entire online store.',
  ];

  togglePricing() {
    this.isAnnual = !this.isAnnual;
  }

  get currentPrice() {
    return this.isAnnual ? '9.99' : '12.99';
  }

  get currentPeriod() {
    return this.isAnnual ? '/month (billed annually)' : '/month';
  }

  get signupLink() {
    return this.isAnnual
      ? 'https://wp.skratchbastid.com/register/top-grillin-annual/'
      : 'https://wp.skratchbastid.com/register/top-grillin-monthly/';
  }

  videoSection: VideoSection = {
    title: 'New in Top Grillin',
    icon: '/img/newintopgrillin.png',
    signUpText: 'Sign up',
    signUpLink: '/join',
    videos: [
      {
        thumbnail: 'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/1b0f07f5-624f-432d-aaf9-f55dd4963224.gif?ClientID=sulu&Date=1759547060&Signature=38df09941c9dc11d1a554ecf8c387106414237a0',
        title: 'Skratch Bastid – Pop-Up – Practice for Japan – Oct 1 2025',
      },
      {
        thumbnail: 'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/b6a9a37e-5e60-4c55-8a36-125b78103e63.gif?ClientID=sulu&Date=1759341510&Signature=45733f351b58dbd3a495cdf3efff48b790415e51',
        title: 'Skratch Bastid & Mr Thing – Tuesday Morning Coffee Sept 30 2025',
      },
      {
        thumbnail: 'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/9038cd99-8ffa-43d5-a5cc-561132da0cb7.gif?ClientID=sulu&Date=1758910930&Signature=1dede87df7bfc8649950381bbb0068eada2c373a',
        title: 'Skratch Bastid – Tuesday Morning Coffee Live from Playlist Retreat (secretly)',
      },
      {
        thumbnail: 'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/561fcfe5-6ed1-4682-a75d-a2af306173dd.gif?ClientID=sulu&Date=1758341232&Signature=4d31800ce9d823deb690438a1995fb33cb964792',
        title: 'Skratch Bastid – Good Records Only Pop-Up Sept 18 2025',
      },
      {
        thumbnail: 'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/083e4589-adf4-4a5f-944a-6f541656a6ea.gif?ClientID=sulu&Date=1758295438&Signature=d85d7dec7f0b2f0e0cebd45d93c1a3cfacd8b802',
        title: 'Skratch Bastid – Tuesday Morning Coffee Sept 16 2025',
      },
      {
        thumbnail: 'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/33f59b03-b194-4584-88b5-53078ca7c3fe.gif?ClientID=sulu&Date=1758341412&Signature=c77f0e63029ff2a26c21642c85b62d44317090bf',
        title: 'Skratch Bastid – Sept 12 2025 – TGIF – Las Vegas prep',
      },
      {
        thumbnail: 'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/1eb1e293-7f43-4fda-a4d4-e7ecf7ca5355.gif?ClientID=sulu&Date=1758341506&Signature=be496919a2d7aa583ec212f2d60cb416ad6bde90',
        title: 'Skratch Bastid – Sept 10 2025 – 1 hour turntable workout – training for Las Vegas BBQ',
      },
      {
        thumbnail: 'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/48589e1f-3d1a-4770-9152-eb21e5158cb9.gif?ClientID=sulu&Date=1757445183&Signature=e820767f274fe7b32cf6fbf91f650f5e6f19ba4e',
        title: 'Skratch Bastid – Tuesday Morning Coffee Sept 9 2025',
      },
      {
        thumbnail: 'https://videoapi-muybridge.vimeocdn.com/animated-thumbnails/image/0f7955af-b80b-4b4e-b6f3-78369d0dadf6.gif?ClientID=sulu&Date=1758341113&Signature=d9d868fb97f1a61e215ca8024522d21a8f75f6ca',
        title: 'Skratch Bastid & Choppa Chop – Sept 7 2025 B2B Sunday Reggae/Dancehall Selections',
      },
    ],
  };
}