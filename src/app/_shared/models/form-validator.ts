import { FormGroup } from '@angular/forms';
export interface FormValidator {
    form: FormGroup;
    validationType: string;
    formSubmitAttempt: boolean;
}