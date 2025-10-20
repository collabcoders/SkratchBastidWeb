import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AudioCarouselComponent, AudioSection } from '../../components/audio-carousel/audio-carousel.component';
import { BBQRecapCarouselComponent, BBQRecapSection } from '../../components/bbq-recap-carousel/bbq-recap-carousel.component';
import { BBQSignupFormComponent } from '../../components/bbq-signup-form/bbq-signup-form.component';

@Component({
  selector: 'app-bastidbbq',
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    AudioCarouselComponent,
    BBQRecapCarouselComponent,
    BBQSignupFormComponent,
  ],
  templateUrl: './bastidbbq.component.html',
  styleUrl: './bastidbbq.component.scss',
})
export class BastidBBQComponent {
  showYouTubeOverlay = false;
  youtubeVideoId = 'ZyCh60l7fr4';

  openYouTubeOverlay() {
    console.log('Opening YouTube overlay');
    this.showYouTubeOverlay = true;
  }

  closeYouTubeOverlay() {
    this.showYouTubeOverlay = false;
  }
  appleMusicSection: AudioSection = {
    title: 'Listen on Apple Music',
    icon: '/img/audiosImg.png',
    backgroundColor: 'bg-[#142129]',
    mixes: [
      {
        image: '/appleMusicCover/image1.jpg',
        link: 'https://music.apple.com/ca/album/skratch-bastid-b2b-hedspin-at-bastids-bbq-toronto-2024/1770889892',
        title: "Skratch Bastid b2b Hedspin at Bastid's BBQ Toronto 2024",
      },
      {
        image: '/appleMusicCover/image2.jpg',
        link: 'https://music.apple.com/ca/album/dj-craze-at-bastids-bbq-toronto-2024-dj-mix/1771554892',
        title: "DJ Craze at Bastid's BBQ Toronto 2024",
      },
      {
        image: '/appleMusicCover/image3.jpg',
        link: 'https://music.apple.com/ca/album/dj-lykx-at-bastids-bbq-toronto-2024-dj-mix/1771553703',
        title: "DJ Lykx at Bastid's BBQ Toronto 2024",
      },
      {
        image: '/appleMusicCover/image4.jpg',
        link: 'https://music.apple.com/ca/album/iced-misto-at-bastids-bbq-toronto-2024-dj-mix/1777868025',
        title: "Iced Misto at Bastid's BBQ Toronto 2024",
      },
      {
        image: '/appleMusicCover/image5.jpg',
        link: 'https://music.apple.com/ca/album/dj-spinbad-80s-megamix-vol-1-dj-mix/1783816065',
        title: 'DJ Spinbad 80s Megamix Vol. 1',
      },
      {
        image: '/appleMusicCover/image6.jpg',
        link: 'https://music.apple.com/ca/album/dj-spinbad-80s-megamix-vol-2-dj-mix/1787085893',
        title: 'DJ Spinbad 80s Megamix Vol. 2',
      },
      {
        image: '/appleMusicCover/image7.jpg',
        link: 'https://music.apple.com/ca/album/nye-2025-dj-mix/1783918753',
        title: 'NYE 2025 DJ Mix',
      },
    ],
  };

  bbqRecapsSection: BBQRecapSection = {
    title: 'BBQ Recaps',
    icon: '/img/videosImg.png',
    recaps: [
      {
        slug: 'halifax-2024',
        city: 'Halifax',
        date: 'September 07, 2024',
        venue: 'Alderney Landing',
        image: 'https://i.ytimg.com/vi/Et1364ewKCg/hqdefault.jpg?sqp=-oaymwFBCNACELwBSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGE4gZShjMA8=&rs=AOn4CLDpZc2f-vF8KjHvO9JmLhQpRQE_9Q',
      },
      {
        slug: 'edmonton-2024',
        city: 'Edmonton',
        date: 'August 25, 2024',
        venue: 'The Backyard',
        image: 'https://i.ytimg.com/vi/R6HuK_urkKg/hqdefault.jpg?sqp=-oaymwFBCNACELwBSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGD8gWihyMA8=&rs=AOn4CLBqVMjCIw05vrsH6qFVYdNNbfxNWw',
      },
      {
        slug: 'vancouver-2024',
        city: 'Vancouver',
        date: 'August 11, 2024',
        venue: 'The Birdhouse',
        image: 'https://i.ytimg.com/vi/qln1xpuuzKs/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBcn_Ozzje7jBLA5iTnD9d9FNX6bQ',
      },
      {
        slug: 'toronto-2024',
        city: 'Toronto',
        date: 'July 27, 2024',
        venue: 'The Bentway',
        image: 'https://i.ytimg.com/vi/nRXq3odkjxw/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDtrDP6CcwcmIE97turiP1a20RYzw',
      },
      {
        slug: 'nyc-2024',
        city: 'New York City',
        date: 'June 08, 2024',
        venue: 'The Seaport',
        image: 'https://i.ytimg.com/vi/EGxJ9pwXkqE/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBpsa7Xm8_JSB-lRKi8dPbHVIGh4w',
      },
      {
        slug: 'calgary-2024',
        city: 'Calgary',
        date: 'June 06, 2024',
        venue: 'Whiskey Rose',
        image: 'https://i.ytimg.com/vi/dvX-XijCIZE/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBSFS6Fq4g9HL003gQ-2vDvTnxN9w',
      },
      {
        slug: 'austin-2024',
        city: 'Austin',
        date: 'March 15, 2024',
        venue: 'Inn Cahoots',
        image: 'https://res.cloudinary.com/dmlnwhtt2/image/upload/v1724290322/bbq-recaps/2024-bbq-austin/austin-bbq-24_h2ofmj.jpg',
      },
      {
        slug: 'edmonton-2023',
        city: 'Edmonton',
        date: 'August 27, 2023',
        venue: 'Home & Away',
        image: 'https://i.ytimg.com/vi/R6HuK_urkKg/hqdefault.jpg?sqp=-oaymwFBCNACELwBSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGD8gWihyMA8=&rs=AOn4CLBqVMjCIw05vrsH6qFVYdNNbfxNWw',
      },
      {
        slug: 'nyc-2023',
        city: 'New York City',
        date: 'August 20, 2023',
        venue: 'The Seaport',
        image: 'https://i.ytimg.com/vi/EGxJ9pwXkqE/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBpsa7Xm8_JSB-lRKi8dPbHVIGh4w',
      },
      {
        slug: 'vancouver-2023',
        city: 'Vancouver',
        date: 'August 13, 2023',
        venue: 'The Birdhouse',
        image: 'https://i.ytimg.com/vi/qln1xpuuzKs/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBcn_Ozzje7jBLA5iTnD9d9FNX6bQ',
      },
      {
        slug: 'toronto-2023',
        city: 'Toronto',
        date: 'July 29, 2023',
        venue: 'The Bentway',
        image: 'https://i.ytimg.com/vi/nRXq3odkjxw/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDtrDP6CcwcmIE97turiP1a20RYzw',
      },
      {
        slug: 'winnipeg-2023',
        city: 'Winnipeg',
        date: 'July 16, 2023',
        venue: '211 McDermot Ave.',
        image: 'https://res.cloudinary.com/dmlnwhtt2/image/upload/v1693429777/bbq-recaps/2023-bbq-winnipeg/BASTIDSBBQ-WINNIPEG-EVENTBRITE-LINEUP-MOCK-02_jfhmqw.png',
      },
      {
        slug: 'calgary-2023',
        city: 'Calgary',
        date: 'July 08, 2023',
        venue: 'Whiskey Rose',
        image: 'https://i.ytimg.com/vi/dvX-XijCIZE/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBSFS6Fq4g9HL003gQ-2vDvTnxN9w',
      },
      {
        slug: 'chicago-2023',
        city: 'Chicago',
        date: 'June 03, 2023',
        venue: 'House of Vans',
        image: 'https://i.ytimg.com/vi/zTlpY8kDmms/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLD2PtWGY0hI0uDdtw9XwAcyXWZosg',
      },
      {
        slug: 'las-vegas-2023',
        city: 'Las Vegas',
        date: 'April 30, 2023',
        venue: 'We All Scream',
        image: 'https://res.cloudinary.com/dmlnwhtt2/image/upload/v1694477323/bbq-recaps/2023-bbq-vegas/BASTIDSBBQ-LASVEGAS-EVENTBRITE-MOCK-03_mvydwo.png',
      },
      {
        slug: 'austin-2023',
        city: 'Austin',
        date: 'March 17, 2023',
        venue: 'SXSW',
        image: 'https://res.cloudinary.com/dmlnwhtt2/image/upload/v1693869671/bbq-recaps/2023-bbq-austin/BASTIDSBBQ-AUSTIN-EVENTBRITE-MOCK-05_1_efxtha.png',
      },
    ],
  };
}