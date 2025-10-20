import { Injectable } from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class ValidationService {

  public creditCardValidator(control: AbstractControl) {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    // tslint:disable-next-line:max-line-length
    if (String(control.value).match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
      return null;
    } else {
      // Invalid credit card number
      return { invalid: true };
    }
  }

  public emailValidator(control: AbstractControl) {
    // RFC 2822 compliant regex
    // tslint:disable-next-line:max-line-length
    if (String(control.value).match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      // Invalid email address
      return { invalid: true };
    }
  }

  public passwordValidator(control: AbstractControl) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (String(control.value).match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      // Password must be at least 6 characters long, and contain a number.
      return { invalid: true };
    }
  }

  public phoneValidator(control: AbstractControl, isUS: boolean) {
    if (control.value == "") {
      return null;
    }
    if (isUS) {
      if (String(control.value).match(/^[(]?[0-9]{3}[)]?[ ,-]?[0-9]{3}[ ,-]?[0-9]{4}$/)) {
        return null;
      } else {
        if (String(control.value).match(/^[+]?([0-9]*[\.\s\-\(\)\(\/)]|[0-9]+){3,24}$/)) {
          // if (control.value.match(
          // /^\+((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])
          // |9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\W*\d){0,13}\d$/
          // )) {
          return null;
        } else {
          return { invalid: true };
        }
        //return { invalid: true };
      }
    } else {
      if (String(control.value).match(/^[+]?([0-9]*[\.\s\-\(\)\(\/)]|[0-9]+){3,24}$/)) {
        // if (control.value.match(
        // /^\+((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])
        // |9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\W*\d){0,13}\d$/
        // )) {
        return null;
      } else {
        return { invalid: true };
      }
    }
  }

  public compareValidator(control: AbstractControl, otherControlName: string) {
    if (!control.parent) {
      return null;
    }

    const otherControl = control.parent.get(otherControlName) as FormControl;
    // tslint:disable-next-line:prefer-const
    let thisControl: any = control;

    // Initializing the validator.
    if (!thisControl) {
      if (!otherControl) {
        throw new Error('compareValidator(): other control is not found in parent group');
      }
      otherControl.valueChanges.subscribe(() => {
        thisControl.updateValueAndValidity();
      });
    }

    if (!otherControl) {
      return null;
    }

    if (otherControl.value !== thisControl.value) {
      return {
        invalid: true
      };
    }
    return null;
  }

  public twoDigitMonthValidator(control: AbstractControl) {
    if (String(control.value).match(/^(1[0-2]|0[1-9])$/)) {
      return null;
    } else {
      return { invalid: true };
    }
  }

  public twoDigitYearValidator(control: AbstractControl) {
    if (!String(control.value).match(/^[0-9]+$/)) {
      return { invalid: true };
    }
    if (String(control.value).length !== 2) {
      return { invalid: true };
    }
    const current_year = new Date().getFullYear();
    // tslint:disable-next-line:radix
    if ((parseInt(String('20' + control.value)) < (current_year - 1)) || (parseInt(String('20' + control.value)) > (current_year + 8))) {
      return { invalid: true };
    }
    return null;
  }

  public fourDigitYearValidator(control: AbstractControl) {
    if (!String(control.value).match(/^[0-9]+$/)) {
      return { invalid: true };
    }
    if (String(control.value).length !== 4) {
      return { invalid: true };
    }
    const current_year = new Date().getFullYear();
    // tslint:disable-next-line:radix
    if ((parseInt(control.value) < (current_year - 1)) || (parseInt(control.value) > (current_year + 8))) {
      return { invalid: true };
    }
    return null;
  }

  public creditCardCvvValidator(control: AbstractControl) {
    if (String(control.value).match(/^[0-9]{3,4}$/)) {
      return null;
    } else {
      return { invalid: true };
    }
  }

  public releaseYearValidator(control: AbstractControl) {
    if (String(control.value).match(/^[0-9]{4}$/)) {
      return null;
    } else {
      return { invalid: true };
    }
  }

  public dateValidator(control: AbstractControl) {
    // //validates short date mm/dd/YYYY format with a year between 1900 and 2099
    // if (control.value.match(/^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/)) {
    //    return null;
    // } else {
    //    //invalid date
    //    return { invalid: true };
    // }

    // mm/dd/yyyy, m/d/yyyy
    // https://regex101.com/r/7iSsmm/2
    const DATE_REGEX = new RegExp(/^(\d{2}|\d)\/(\d{2}|\d)\/\d{4}$/);
    // h:mm am/pm, hh:mm AM/PM
    // https://regex101.com/r/j2Cfqd/1/
    const TIME_REGEX = new RegExp(/^((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))$/);

    const dateStr = String(control.value);
    // First check for m/d/yyyy format
    // If pattern is wrong, don't validate yet
    if (!DATE_REGEX.test(dateStr)) {
      return { invalid: true };
    }
    // Length of months (will update for leap years)
    const monthLengthArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Parse the date input to integers
    const dateArr = dateStr.split('/');
    const month = parseInt(dateArr[0], 10);
    const day = parseInt(dateArr[1], 10);
    const year = parseInt(dateArr[2], 10);
    // Today's date
    const now = new Date();

    // Validate year and month
    if (year < now.getFullYear() || year > 3000 || month === 0 || month > 12) {
      return null;
    }
    // Adjust for leap years
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
      monthLengthArr[1] = 29;
    }
    // Validate day
    if (!(day > 0 && day <= monthLengthArr[month - 1])) {
      return null;
    }
    // If date is properly formatted, check the date vs today to ensure future
    // This is done this way to account for new Date() shifting invalid
    // date strings. This way we know the string is a correct date first.
    const date = new Date(dateStr);
    if (date <= now) {
      return null;
    }
    return { invalid: true };
  }
}
