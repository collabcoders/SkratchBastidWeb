import { APP_INITIALIZER, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertComponent } from './_shared/components/alert/alert.component';
import { DatePipe } from '@angular/common';
import { CheckImagePipe } from './_shared/pipes/check-image.pipe';
import { ImagePipe } from './_shared/pipes/image.pipe';
import { SafePipe } from './_shared/pipes/safe.pipe';
import { VideoPipe } from './_shared/pipes/video.pipe';
import { InterceptorService } from '@shared/services/interceptor.service';
import { NgxMarqueeModule } from 'ngx-marquee';
import { AudioPlayerComponent } from './_shared/components/audio-player/audio-player.component';
import { TooltipModule, TooltipOptions } from 'ng2-tooltip-directive';
// import { MusicComponent } from './views/music/music.component';
// import { StreamComponent } from './views/stream/stream.component';
// import { VideosComponent } from './views/videos/videos.component';
import * as bootbox from 'bootbox';
import * as $ from 'jquery';
import * as moment from 'moment';
import * as bootstrap from 'bootstrap';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { RouterModule } from '@angular/router';
import { AngularWavesurferServiceModule } from '@shared/angular-wavesurfer-service-global';
import { CoursePaymentComponent } from '@shared/components/course-payment/course-payment.component';
// import { ImageCropperComponent } from 'ngx-image-cropper';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { LoginComponent } from './views/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { FormsComponent } from './forms/forms.component';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from '@env/environment';
import { FavoritesModalComponent } from '@shared/components/favorites-modal/favorites-modal.component';
import { VipLoginDialogComponent } from '@shared/components/vip-login-dialog/vip-login-dialog.component';
import { BastidBBQDetailComponent } from './views/bastidbbq-detail/bastidbbq-detail.component';
import { RotwDetailComponent } from './views/rotw-detail/rotw-detail.component';
// import { VideosComponent as v } from './views/videos/videos.component';
// import { HomeComponent as h } from './views/home/home.component';

export const MyDefaultTooltipOptions: TooltipOptions = {
  'tooltipClass': 'ng-tooltip',
  'showDelay': 0
}

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    AudioPlayerComponent,
    CoursePaymentComponent,
    UpgradeComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    AngularWavesurferServiceModule,
    NgxMarqueeModule,
    TooltipModule.forRoot(MyDefaultTooltipOptions as TooltipOptions),
    CommonModule,
    HeaderComponent,
    // ImageCropperComponent,
    CheckImagePipe,
    ImagePipe,
    SafePipe,
    VideoPipe,
    VideoPlayerComponent,
    FormsComponent,
    FavoritesModalComponent,
    VipLoginDialogComponent,
    BastidBBQDetailComponent,
    RotwDetailComponent,
    NgxStripeModule.forRoot(environment.stripeKey)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    DatePipe
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
