import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { FreeTrialFormComponent } from '../../components/free-trial-form/free-trial-form.component';
import {
  EventCardComponent,
  EventDetails,
} from '../../components/event-card/event-card.component';

@Component({
  selector: 'app-events',
  imports: [HeaderComponent, FooterComponent, EventCardComponent, FreeTrialFormComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent {
  upcomingEvents: EventDetails[] = [
    {
      month: 'Oct',
      day: '11',
      location: 'TOKYO, JAPAN',
      venue: '',
      details: '2025 DMC World Finals @ O-EAST',
      ticketsLink: 'https://dmc.zaiko.io/e/dmc40tokyo',
    },
    {
      month: 'Oct',
      day: '15',
      location: 'Toronto, ON',
      venue: 'Toronto Beach Club (1681 Lake Shore Blvd E)',
      details: 'ROLL & BOWL - TORONTO (5 PM - 10 PM)',
      ticketsLink: 'https://events.frontdoor.plus/event/1587',
    },
    {
      month: 'Oct',
      day: '27',
      location: 'Winnipeg, MB',
      venue: 'Pyramid Cabaret (176 Fort St)',
      details: 'ROLL & BOWL - WINNIPEG (5 PM - 10 PM)',
      ticketsLink: 'https://events.frontdoor.plus/event/1590',
    },
  ];
}