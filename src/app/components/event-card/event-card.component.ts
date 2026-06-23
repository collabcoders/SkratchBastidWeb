import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '@shared/models/event';

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
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './event-card.component.scss',
})
export class EventCardComponent {
  event = input.required<Event>();
}