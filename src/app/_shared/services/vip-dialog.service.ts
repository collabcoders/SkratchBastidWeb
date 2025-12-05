import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VipDialogService {
  private isDialogVisibleSubject = new BehaviorSubject<boolean>(false);
  public isDialogVisible$ = this.isDialogVisibleSubject.asObservable();

  constructor() {}

  showDialog() {
    this.isDialogVisibleSubject.next(true);
  }

  hideDialog() {
    this.isDialogVisibleSubject.next(false);
  }

  get isDialogVisible(): boolean {
    return this.isDialogVisibleSubject.value;
  }
}