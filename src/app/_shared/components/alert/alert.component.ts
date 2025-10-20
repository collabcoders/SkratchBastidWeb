import { Component, Input, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Alert, AlertType } from '@shared/models/alert';
import { AlertService } from '@shared/services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  standalone: false,
})
export class AlertComponent implements OnInit {
  @Input() id = 'default-alert';
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription!: Subscription;
  routeSubscription!: Subscription;

  constructor(private router: Router, private alertService: AlertService) { }

  ngOnInit() {
    // subscribe to new alert notifications
    this.alertSubscription = this.alertService.onAlert(this.id)
    .subscribe(alert => {
        // clear alerts when an empty alert is received
        if (!alert.message) {
            // filter out alerts without 'keepAfterRouteChange' flag
            this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);

            // remove 'keepAfterRouteChange' flag on the rest
            this.alerts.forEach(x => delete x.keepAfterRouteChange);
            return;
        }

        // add alert to array
        this.alerts.push(alert);

        // auto close alert if required
        if (alert.autoClose) {
            setTimeout(() => this.removeAlert(alert), 3000);
        }
    });

    // clear alerts on location change
    this.routeSubscription = this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
            this.alertService.clear(this.id);
        }
    });
  }

  getIcon(alert: Alert) {
    if (!alert) return;
    const classes = ['fas'];
    const alertTypeClass = {
        [AlertType.Success]: 'fa-check-circle',
        [AlertType.Error]: 'fa-exclamation-triangle',
        [AlertType.Info]: 'fa-info-circle',
        [AlertType.Warning]: 'fa-exclamation-circle'
    }
    classes.push(alertTypeClass[alert.type]);
    return classes.join(' ')
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  removeAlert(alert: Alert) {
      // check if already removed to prevent error on auto close
      if (!this.alerts.includes(alert)) return;

      if (this.fade) {
          // fade out alert
          this.alerts.find(x => x === alert)!.fade = true;

          // remove alert after faded out
          setTimeout(() => {
              this.alerts = this.alerts.filter(x => x !== alert);
          }, 250);
      } else {
          // remove alert
          this.alerts = this.alerts.filter(x => x !== alert);
      }
  }

  cssClass(alert: Alert) {
    if (!alert) return;

    const classes = ['alert', 'alert-dismissable', 'd-flex', 'align-items-center'];
            
    const alertTypeClass = {
        [AlertType.Success]: 'alert-success',
        [AlertType.Error]: 'alert-danger',
        [AlertType.Info]: 'alert-info',
        [AlertType.Warning]: 'alert-warning'
    }

    classes.push(alertTypeClass[alert.type]);

    if (alert.fade) {
        classes.push('fade');
    }

    return classes.join(' ');
  }
}