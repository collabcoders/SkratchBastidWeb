import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-events',
  imports: [HeaderComponent, FooterComponent, EventCardComponent, FreeTrialFormComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent implements OnInit {
  upcomingEvents: EventDetails[] = [];

  constructor(private apiService: ApiService, private alertService: AlertService,) {}

  ngOnInit(): void {
    this.apiService.getSectionData('event').subscribe((data) => {
      this.upcomingEvents = data?.data?.filter((event: any) => event.upcoming === true);
    }, (error) => {
      this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
    });
  }
}