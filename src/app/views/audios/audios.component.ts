import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { FreeTrialFormComponent } from '../../components/free-trial-form/free-trial-form.component';
import {
  AudioCarouselComponent,
  AudioSection,
} from '../../components/audio-carousel/audio-carousel.component';

@Component({
  selector: 'app-audios',
  imports: [HeaderComponent, FooterComponent, AudioCarouselComponent, FreeTrialFormComponent],
  templateUrl: './audios.component.html',
  styleUrl: './audios.component.scss',
})
export class AudiosComponent {
  audioSections: AudioSection[] = [
    {
      title: 'Listen on Apple Music',
      icon: '/img/audiosImg.png',
      backgroundColor: 'bg-white',
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
    },
    {
      title: 'More Mixes',
      icon: '/img/audiosImg.png',
      backgroundColor: 'bg-gray-200',
      decorativeStripes: true,
      mixes: [
        {
          image:
            'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/e/0/a/1/9cb7-4ff2-4157-8379-54efebc741ac',
          link: 'https://www.mixcloud.com/skratchbastid/skratch-bastid-dinner-a-mixtape-41218/',
          title: 'Dinner: A Mixtape',
        },
        {
          image:
            'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/e/b/c/2/a3d2-6a91-4c27-9eee-c845a489e030.jpg',
          link: 'https://www.mixcloud.com/skratchbastid/skratch-bastid-the-gaff-soul-sisters-stand-up-100-female-funksoulrbbreaks/',
          title: 'Soul Sisters Stand Up',
        },
        {
          image:
            'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/2/1/e/9/bde2-8de1-4e85-8978-e1aed313c9e6.jpg',
          link: 'https://www.mixcloud.com/skratchbastid/skratch-bastid-the-starter-era-dope-raps-1989-1993-sneaker-freaker-magazine-exclusive/',
          title: 'The Starter Era: Dope Raps 1989-1993',
        },
        {
          image:
            'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/5/7/c/2/c7e8-e095-42e1-a751-fb51772a4473.png',
          link: 'https://www.mixcloud.com/skratchbastid/the-entertainer/',
          title: 'The Entertainer',
        },
        {
          image:
            'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/2/c/d/9/5b72-edd3-4317-b49d-28a38f9a3da0.jpg',
          link: 'https://www.mixcloud.com/skratchbastid/skratch-bastid-110/',
          title: 'Skratch Bastid 110',
        },
        {
          image:
            'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/a/3/4/4/b475-e99f-491e-886f-3ff2820ec7bd.jpg',
          link: 'https://www.mixcloud.com/skratchbastid/skratch-bastid-satisfaction-guaranteed/',
          title: 'Satisfaction Guaranteed',
        },
        {
          image:
            'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/c/2/f/d/0ded-0b9e-45ea-81e1-007fd8e75c0d.jpg',
          link: 'https://www.mixcloud.com/skratchbastid/skratch-bastid-get-up/',
          title: 'Get Up',
        },
      ],
    },
    {
      title: 'Songs We Listened To A Lot In...',
      icon: '/img/audiosImg.png',
      backgroundColor: 'bg-white',
      mixes: [
        {
          image:
            'https://imagedelivery.net/pBWn_5oX0Np5kM_4V8gAww/1369844c-cd95-4a48-2a46-8277a2919200/public',
          link: '/mixes/songs-we-listened-to-alot-in-2023',
          title: '2023',
        },
        {
          image:
            'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/1/7/a/3/47a0-779b-4bb2-8819-7cc3f0f349fe',
          link: '/mixes/songs-we-listened-to-alot-in-2022',
          title: '2022',
        },
        {
          image:
            'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/f/1/3/5/6472-56a1-4bc9-9146-ae47b5ecd9bc',
          link: 'https://www.mixcloud.com/skratchbastid/skratch-bastid-cosmo-baker-songs-we-listened-to-a-lot-in-2021/',
          title: '2021',
        },
        {
          image:
            'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/0/c/2/4/b2d4-7208-4ab4-b063-f96eed651e39',
          link: 'https://www.mixcloud.com/skratchbastid/skratch-bastid-cosmo-baker-songs-we-listened-to-a-lot-in-2020/',
          title: '2020',
        },
        {
          image:
            'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/8/d/f/c/f28c-4b06-4b23-a4f2-41dbd87ffbac',
          link: 'https://www.mixcloud.com/skratchbastid/songs-we-listened-to-a-lot-in-2016/',
          title: '2016',
        },
        {
          image:
            'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/2/6/d/b/78e1-fe17-49b9-a9b1-4c84c7582bf3.jpg',
          link: 'https://www.mixcloud.com/skratchbastid/skratch-bastid-cosmo-baker-songs-we-listened-to-a-lot-in-2015/',
          title: '2015',
        },
        {
          image:
            'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/b/9/2/f/ce3f-253a-434b-90ea-ec4201371746.jpg',
          link: 'https://www.mixcloud.com/skratchbastid/skratch-bastid-cosmo-baker-songs-we-listened-to-a-lot-in-2014/',
          title: '2014',
        },
        {
          image:
            'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/3/f/d/d/ca63-ec0c-4f44-af85-67eee327196f.jpeg',
          link: 'https://www.mixcloud.com/skratchbastid/skratch-bastid-cosmo-baker-songs-we-listened-to-a-lot-in-2013/',
          title: '2013',
        },
        {
          image:
            'https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/1/4/f/8/bc9c-5053-4cc1-9261-f72229fe24a0.jpg',
          link: 'https://www.mixcloud.com/skratchbastid/skratch-bastid-cosmo-baker-songs-we-listened-to-a-lot-in-2012/',
          title: '2012',
        },
      ],
    },
  ];
}
