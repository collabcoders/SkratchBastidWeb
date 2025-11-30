import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ApiService } from '@shared/services/api.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { FreeTrialFormComponent } from '../../components/free-trial-form/free-trial-form.component';
import {
  EventCardComponent,
  EventDetails,
} from '../../components/event-card/event-card.component';
import { AlertService } from '@shared/services/alert.service';
import { Config } from '@shared/config';
import { environment } from '@env/environment';
import { Event } from '@shared/models/event';
import { AppData } from 'src/app/app.data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  imports: [HeaderComponent, FooterComponent, EventCardComponent, FreeTrialFormComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent implements OnInit {
  upcomingEvents: Event[] = [];

  constructor(private apiService: ApiService, private alertService: AlertService, private appData: AppData, private router: Router) {}

  isLoadingEvent: WritableSignal<boolean> = signal(false);
  ngOnInit(): void {
    this.isLoadingEvent.set(true);
    if (environment.ismock) {
      this.apiService.getSectionData('event').subscribe((data) => {
        this.upcomingEvents = data?.data?.filter((event: any) => event.upcoming === true);
        this.isLoadingEvent.set(false);
      }, (error) => {
        this.isLoadingEvent.set(false);
        this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
      });
    } else {
        this.apiService.getData('events', '', '').subscribe((data: any) => {
          this.upcomingEvents = data?.data;
          this.isLoadingEvent.set(false);
        }, (error) => {
          this.isLoadingEvent.set(false);
          // this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
        })
    }
  }

  openSignup() {
    this.appData.planOpen.set('free');
    this.router.navigate(['/join']);
  }
}