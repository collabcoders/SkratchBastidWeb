import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '@shared/services/alert.service';
import { ApiService } from '@shared/services/api.service';
import { BehaviorSubject } from 'rxjs';
declare var $: any;
declare var bootbox: any;

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginTitle = 'Member Sign In';
  loginForm: { form: FormGroup, formSubmitAttempt: boolean };
  processingSignin = false;
  formProcessing$ = new BehaviorSubject<boolean>(false);
  @Output() logIn = new EventEmitter<void>();
  token = {
    set: (data: any) => {}
  };
  appData = { loginFromBeats: false };
  showReJoin(id: any) { bootbox.alert('Upgrade logic for id: ' + id); }

  constructor(private fb: FormBuilder, private api: ApiService, private alertService: AlertService,) {
    this.loginForm = {
      form: this.fb.group({
        username: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      }),
      formSubmitAttempt: false
    };
  }

  login(e: any) {
    console.log("login", this.loginForm.form.value);
    e.preventDefault();
    this.alertService.clear();
    this.loginForm.formSubmitAttempt = true;
    if (this.loginForm.form.valid) {
      this.formProcessing$.next(true);
      this.processingSignin = true;
      console.log("POST");
      this.api.post('MemberLogin?app=skratchbastid', this.loginForm.form.value, true, true)
        .subscribe((data: any) => {
          console.log(data);
          if (data.error) {
            this.alertService.error('Error', data.msg);
            try {
              (document.querySelector('#tidio-chat iframe') as HTMLElement).style.visibility = 'visible';
            } catch (err) {}
            this.processingSignin = false;
          } else {
            this.token.set(data.data);
            this.logIn.emit();
            $('#loginModal').modal('hide');
            try {
              (document.querySelector('#tidio-chat iframe') as HTMLElement).style.visibility = 'visible';
            } catch (err) {}
            if (['expired', 'inactive', 'canceled'].includes(data.data.status)) {
              if (!this.appData.loginFromBeats) {
                bootbox.dialog({
                  message: data.msg,
                  buttons: {
                    ok: {
                      label: 'Upgrade',
                      callback: () => {
                        this.showReJoin(data.id);
                      }
                    }
                  }
                });
              }
            } else {
              if (data.msg && data.msg.indexOf('Your Beat Making Course') !== -1) {
                bootbox.alert(data.msg);
              } else {
                this.alertService.success('Sign-In Successful', data.msg);
                setTimeout(() => window.location.reload(), 1000);
              }
            }
            this.processingSignin = false;
          }
        });
    } else {
      this.alertService.error('Error', 'Invalid Email/Password');
      this.processingSignin = false;
    }
  }
}
