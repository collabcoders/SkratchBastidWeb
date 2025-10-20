import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JoinComponent } from './views/join/join.component';
import { LoginComponent } from './views/login/login.component';
import { VideosComponent } from './views/videos/videos.component';
import { VideoDetailComponent } from './views/video-detail/video-detail.component';
import { TopGrillinComponent } from './views/topgrillin/topgrillin.component';
import { EventsComponent } from './views/events/events.component';
import { AudiosComponent } from './views/audios/audios.component';
import { BastidBBQComponent } from './views/bastidbbq/bastidbbq.component';
import { HomeComponent } from './views/home/home.component';
import { PaymentSuccessComponent } from './views/topgrillin/payment-success/payment-success.component';
import { ProfileComponent } from './views/profile/profile.component';
import { NewsletterComponent } from './views/newsletter/newsletter.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'join', component: JoinComponent },
  { path: 'login', component: LoginComponent },
  { path: 'videos', component: VideosComponent },
  { path: 'videos/:id', component: VideoDetailComponent },
  { path: 'audios', component: AudiosComponent },
  { path: 'events', component: EventsComponent },
  { path: 'topgrillin', component: TopGrillinComponent },
  { path: 'bastidbbq', component: BastidBBQComponent},
  { path: 'newsletter', component: NewsletterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'topgrillin/payment-success', component: PaymentSuccessComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    //useHash: true,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 122] // [x, y]
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
