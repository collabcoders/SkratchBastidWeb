import { FormGroup } from '@angular/forms';

export interface DialogData {
    title: string;
    body: string;
    confirmButton: string;
    cancelButton: string;
    disableClose: boolean
}

export interface Pagination {
    page: number;
    sort: string;
    dir: string;
    rows: number;
    keywords: string;
    genreId: number;
    chart: string;
}

export interface Validator {
    form: FormGroup;
    validationType: string;
    formSubmitAttempt: boolean;
}