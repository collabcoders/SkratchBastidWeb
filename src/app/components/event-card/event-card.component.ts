import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface EventDetails {
  month: string;
  day: string;
  location: string;
  venue: string;
  details: string;
  ticketsLink: string;
}

@Component({
  selector: 'app-event-card',
  imports: [CommonModule],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
})
export class EventCardComponent {
  event = input.required<EventDetails>();
}